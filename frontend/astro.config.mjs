// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: process.env.NODE_ENV === 'production' 
            ? 'http://10.147.19.25:3000/'
            : 'http://10.147.19.25:3000/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          ws: true,
        },
        '/socket.io': {
          target: 'http://10.147.19.25:3000',
          ws: true,
          changeOrigin: false
        }
      }
    }
  }
});