import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import db from '@astrojs/db';
import auth from 'auth-astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    db(),
    auth(),
    react(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});