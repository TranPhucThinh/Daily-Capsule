import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['capsule-mark.svg'],
      manifest: {
        name: 'Daily Capsule',
        short_name: 'Capsule',
        description: 'Lưu giữ một kỷ niệm mỗi ngày.',
        theme_color: '#F3EFE7',
        background_color: '#F3EFE7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/capsule-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,jpg,woff2}']
      }
    })
  ]
});
