import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['src/main.jsx', 'src/setupTests.js'],
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://127.0.0.1:8080',
        ws: true,
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
