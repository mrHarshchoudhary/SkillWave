import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Set the root to the correct directory
  build: {
    outDir: 'dist', // Ensure it builds inside `skillwave/dist`
    emptyOutDir: true, // Clean the output directory before building
  },
});
