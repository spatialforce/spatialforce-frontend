import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'leaflet': resolve(__dirname, 'node_modules/leaflet')
    }
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Remove or fix the auth chunk that's causing the issue
          utils: ['axios', 'js-cookie'],
          icons: ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
          leaflet: ['leaflet', 'react-leaflet'],
          seo: ['react-helmet-async']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
       
      }
    },
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'leaflet',
      'react-leaflet',
      'axios',
      'react',
      'react-dom',
      'react-router-dom',
      'js-cookie',
      'react-helmet-async',
      '@fortawesome/react-fontawesome'
    ],
    exclude: ['@fortawesome/free-solid-svg-icons']
  },
  define: {
    'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production')
  }
});