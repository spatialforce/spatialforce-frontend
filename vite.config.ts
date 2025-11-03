import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/*',
          dest: 'assets'
        },
        {
          src: 'node_modules/leaflet/dist/images/*',
          dest: 'leaflet-images'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'leaflet': resolve(__dirname, 'node_modules/leaflet')
    }
  },
  server: {
    proxy: {
      '/spatialforce': {
        target: 'https://spatialforce.co.zw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/spatialforce/, ''),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://spatialforce.co.zw');
            proxyReq.setHeader('Referer', 'https://spatialforce.co.zw');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        }
      },
      '/covid-api': {
        target: 'https://disease.sh',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/covid-api/, '/v3/covid-19'),
        secure: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },
      '/geo': {
        target: 'https://raw.githubusercontent.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo/, '/johan/world.geo.json/master'),
        secure: true,
        headers: {
          'Accept': 'application/json'
        }
      }
    },
    // Remove the HTTPS configuration unless you have proper certificates
  },
  build: {
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks: {
          leaflet: ['leaflet', 'react-leaflet'],
          vendor: ['react', 'react-dom', 'axios']
        }
      }
    },
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'leaflet',
      'leaflet.heat',
      'react-leaflet',
      'axios',
      'react',
      'react-dom'
    ]
  },
  // Replace the process.env definition with specific variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_BASE': JSON.stringify(process.env.VITE_API_BASE || '/covid-api'),
    'process.env.VITE_GEO_BASE': JSON.stringify(process.env.VITE_GEO_BASE || '/geo'),
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
});