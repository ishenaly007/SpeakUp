/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', 
    port: 5500,       
    proxy: {
      '/api': { 
        target: 'http://localhost:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Optional setup file
  },
})
