import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Em desenvolvimento, o Vite repassa toda chamada /api para o backend.
// Assim o navegador acha que frontend e backend são o mesmo site (sem problema de CORS).
// Backend Python (padrão): http://localhost:8000
// Backend Java:            API_URL=http://localhost:8080 npm run dev
const API_URL = process.env.API_URL || 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': API_URL,
    },
  },
})
