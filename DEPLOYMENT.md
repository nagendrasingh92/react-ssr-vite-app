# Deployment Guide for React SSR with Vite

## Render.com (Recommended for SSR)

### Option 1: Using render.yaml (Automatic)
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect the `render.yaml` file and deploy

### Option 2: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `react-ssr-vite`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18` (or latest)

### Environment Variables
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)

## Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Local Testing

```bash
# Development
npm run dev

# Production build test
npm run build
npm start
```

## File Structure After Build

```
dist/
├── client/          # Client-side assets
│   ├── index.html
│   └── assets/
└── server/          # Server-side bundle
    └── main.js
```

## Features Included

- ✅ Server-Side Rendering (SSR)
- ✅ React Router with SSR support
- ✅ Vite build system
- ✅ Express.js server
- ✅ Security headers (Helmet)
- ✅ Compression middleware
- ✅ Request logging (Morgan)
- ✅ Error handling
- ✅ Health check endpoint
