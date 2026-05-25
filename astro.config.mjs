import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://raquelsimancas.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap()],
});
