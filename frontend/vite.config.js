import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  // Deploy the app at the web document root (htdocs or public_html).
  // Root URLs keep assets and API routes correct after any React route refresh.
  base: '/',
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
});
