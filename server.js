import fs from 'fs'
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const isProd = process.env.NODE_ENV === 'production'

console.log('Environment:', isProd ? 'production' : 'development')
console.log('Working directory:', process.cwd())

// Basic security & performance middleware
app.use(helmet({
  contentSecurityPolicy: false // Keep simple for example; consider enabling with nonces in real apps
}))
app.use(compression())
app.use(morgan(isProd ? 'combined' : 'dev'))

// Health check endpoint
app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

let vite
let template

if (!isProd) {
  // Development mode - use Vite dev server
  const { createServer: createViteServer } = await import('vite')
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)
  template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8')
} else {
  // Production mode - serve built static assets
  const distClientDir = path.resolve(process.cwd(), 'dist/client')
  
  // Check if dist/client directory exists
  if (!fs.existsSync(distClientDir)) {
    console.error('Error: dist/client directory not found. Make sure to run npm run build first.')
    process.exit(1)
  }
  
  // Check if index.html exists
  const templatePath = path.join(distClientDir, 'index.html')
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/client/index.html not found. Make sure to run npm run build first.')
    process.exit(1)
  }
  
  app.use('/assets', express.static(path.join(distClientDir, 'assets'), {
    maxAge: '1y',
    immutable: true
  }))
  app.use(express.static(distClientDir, { index: false, maxAge: '1h' }))
  template = fs.readFileSync(templatePath, 'utf-8')
}

// Catch-all route for SSR
app.use(async (req, res) => {
  try {
    const url = req.originalUrl
    let html = template
    
    if (!isProd) {
      // Development mode - transform HTML with Vite
      html = await vite.transformIndexHtml(url, html)
    }
    
    // Load render function based on environment
    let renderModule
    if (!isProd) {
      // Development mode - load from source using Vite
      renderModule = await vite.ssrLoadModule('/src/server/main.tsx')
    } else {
      // Production mode - load from built files
      renderModule = await import(path.resolve(process.cwd(), 'dist/server/main.js'))
    }
    
    const render = renderModule && (renderModule.render || renderModule.default)
    if (typeof render !== 'function') {
      throw new Error('SSR entry did not export a render function')
    }
    
    console.log('Rendering URL:', url)
    const { html: appHtml } = await render(url)
    
    // Replace the placeholder with the rendered HTML
    const htmlWithContent = html.replace('<!--ssr-outlet-->', appHtml)
    
    res
      .status(200)
      .set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      })
      .send(htmlWithContent)
  } catch (error) {
    if (!isProd && vite) vite.ssrFixStacktrace(error)
    console.error('SSR Error:', error)
    if (res.headersSent) return
    res
      .status(500)
      .type('html')
      .send('<!DOCTYPE html><html><head><title>500</title></head><body><h1>Internal Server Error</h1><p>SSR failure.</p></body></html>')
  }
})

// 404 handler (only reached if SSR middleware didn't handle)
app.use((req, res, next) => {
  if (res.headersSent) return next()
  res.status(404).json({ error: 'Not Found', path: req.originalUrl })
})

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  if (res.headersSent) return next(err)
  const body = isProd
    ? { error: 'Internal Server Error' }
    : { error: 'Internal Server Error', details: err?.stack || String(err) }
  res.status(err.status || 500).json(body)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
