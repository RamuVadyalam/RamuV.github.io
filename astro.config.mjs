import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Project page: served at https://<user>.github.io/<repo>/
// The repo is `RamuV.github.io` hosted under user `ramuvadyalam`,
// so the public base path is `/RamuV.github.io`.
const SITE_ORIGIN = 'https://ramuvadyalam.github.io';
const BASE_PATH = '/RamuV.github.io';

export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
});
