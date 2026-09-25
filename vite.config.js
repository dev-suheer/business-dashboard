import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* Keeps development same-origin, so the session cookie needs no CORS entry. Set
     VITE_API_URL instead when the app and the API are deployed to different origins. */
  server: { proxy: { '/api': 'http://localhost:6050' } },
})
