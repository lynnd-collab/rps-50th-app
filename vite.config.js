import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'autoUpdate' activates the new service worker immediately on detection
      // and reloads the page, preventing stale-cache blank-screen issues.
      registerType: 'autoUpdate',
      manifest: {
        name: 'RPS 50th Anniversary',
        short_name: 'RPS 50th',
        description: 'Renal Pathology Society 50th Anniversary App',
        theme_color: '#0C447C',
        background_color: '#0C447C',
        display: 'standalone',
        icons: [
          // PNG icons — required by iOS and most Android launchers.
          {
            src: '/kidney-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/kidney-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          // SVG fallback for modern desktop browsers.
          {
            src: '/kidney-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
