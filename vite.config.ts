import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Memory-game-website/',
  server: {
    host: true   // 👈 ADD THIS LINE
  }
});