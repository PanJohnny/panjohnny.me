import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://panjohnny.me',
  integrations: [sitemap({
    filter: (page) => /\/projects\/[^\/]+/.test(page) && !page.includes('/tag/')
  }), icon()],
  i18n: {
    locales: ['en', 'cs'],
    defaultLocale: 'en',
  }
});