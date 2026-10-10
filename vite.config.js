import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import site from './site.config.json' with { type: 'json' };

// In sviluppo le API PHP girano su un server separato (npm run dev:api)
const PHP_DEV_SERVER = 'http://127.0.0.1:5180';

// Indirizzo pubblico del sito: si cambia solo in site.config.json
const SITE_URL = String(site.siteUrl || '').replace(/\/+$/, '');

// Inserisce il dominio in index.html e genera robots.txt e sitemap.xml
const siteFiles = () => ({
  name: 'sapore-verace-site-files',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    });
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source:
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
        '</urlset>\n',
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteFiles()],
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
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'ui-vendor', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils|lucide-react)[\\/]/ },
          ],
        },
      },
    },
  },
});
