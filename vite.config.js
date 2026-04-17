import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'RPS 50th Anniversary',
        short_name: 'RPS 50th',
        description: 'Renal Pathology Society 50th Anniversary App',
        theme_color: '#0C447C',
        background_color: '#0C447C',
        display: 'standalone',
        icons: [
          // SVG icon covers all sizes; 'any' tells the browser to scale as needed.
          // 'maskable' allows Android to apply its adaptive icon mask.
          {
            src: '/kidney-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          // Explicit size hints for platforms that look for exact dimensions.
          {
            src: '/kidney-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/kidney-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
})
