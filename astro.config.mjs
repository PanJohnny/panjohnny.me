import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://panjohnny.me',
  integrations: [sitemap()],
  i18n: {
    locales: ['en', 'cs'],
    defaultLocale: 'en',
  }
});