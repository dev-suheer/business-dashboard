import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* Keeps development same-origin, so the session cookie needs no CORS entry. Set
     VITE_API_URL instead when the app and the API are deployed to different origins. */
  /* 127.0.0.1, not localhost: on many machines localhost is IPv6 and the API
     is only listening on IPv4. The browser still talks to the Vite origin, so
     the session cookie stays first-party. */
  server: { proxy: { '/api': 'http://127.0.0.1:6050' } },
})
