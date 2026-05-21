import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('swiper')) return 'vendor-swiper';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'vendor-forms';
            if (id.includes('@radix-ui')) return 'vendor-ui';
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
