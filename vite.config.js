import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In sviluppo le API PHP girano su un server separato (npm run dev:api)
const PHP_DEV_SERVER = 'http://127.0.0.1:5180';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': PHP_DEV_SERVER,
      '/uploads': PHP_DEV_SERVER,
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Librerie in un file separato: restano in cache quando aggiorni solo i contenuti del sito
        advancedChunks: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'ui-vendor', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils|lucide-react)[\\/]/ },
          ],
        },
      },
    },
  },
});
