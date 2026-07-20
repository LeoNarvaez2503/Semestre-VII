import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Allows frontend to call '/api/v1/...' in dev without CORS issues.
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    }
  }

  if (command === 'serve') {
    config.base = '/'
  } else {
    config.base = '/KairosMix/'
  }

  return config
})
