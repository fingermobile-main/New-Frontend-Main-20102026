import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      external: [], // Specify external dependencies if needed
    },
  },
  optimizeDeps: {
    exclude: [], // Specify modules to exclude from optimization if needed
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
