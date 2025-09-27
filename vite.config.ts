import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => {
  const isSSR = Boolean(isSsrBuild)
  return {
    plugins: [react()],
    publicDir: 'public',
    build: {
      ssr: isSSR ? 'src/server/main.tsx' : false,
      manifest: !isSSR,
      outDir: isSSR ? 'dist/server' : 'dist/client',
      rollupOptions: isSSR
        ? {
            input: 'src/server/main.tsx'
          }
        : {
            input: 'index.html'
          }
    },
    server: {
      port: 5173
    },
    ssr: { noExternal: [] }
  }
})
