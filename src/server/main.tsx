import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from '../App'

export async function render(url: string) {
  try {
    const html = renderToString(
      <React.StrictMode>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </React.StrictMode>
    )
    return { html }
  } catch (error) {
    console.error('SSR Render Error:', error)
    return { html: '<div>Error rendering page</div>' }
  }
}
