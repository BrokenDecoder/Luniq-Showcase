import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/Carosule/**']
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('ogl')) {
              return 'webgl-vendor';
            }
            if (id.includes('gsap') || id.includes('@gsap')) {
              return 'gsap-vendor';
            }
            if (id.includes('framer-motion') || id.includes('motion')) {
              return 'motion-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            if (id.includes('lenis')) {
              return 'lenis-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
