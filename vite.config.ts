import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Memory-game-website/',  // 👈 keep this
  server: {
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});