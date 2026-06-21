import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    server: {
    allowedHosts: [
      'patrilineal-ashely-unpadded.ngrok-free.dev',
      '.ngrok-free.dev' // Wildcard kaikille ngrok domainille
    ]
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo_mani.png'],
      manifest: false, // Käytä public/manifest.json
      workbox: {
        // Nosta raja 5MB:iin JA jätä suuret kuvat pois precachesta
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        globPatterns: ['**/*.{js,css,html,ico,svg}'], // Ei jpg/jpeg/png precacheen!
        // Cacheta kuvat dynaamisesti kun niitä tarvitaan
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 päivää
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 vuosi
              }
            }
          }
        ]
      }
    })
  ]
})