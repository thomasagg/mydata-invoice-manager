import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // forward /api requests to the Spring Boot backend
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
