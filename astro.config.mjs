import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

// Fix SSL umbraco api locally
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const { PUBLIC_LOCALES, PUBLIC_DEFAULT_LOCALE } = loadEnv(
  import.meta.env,
  process.cwd(),
  '',
);

export default defineConfig({
  vite: {
    plugins: [
      qrcode({
        // filter: (url) => url === 'http://192.168.199.231:4321/'
      }),
    ],
  },
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()],
  i18n: {
    defaultLocale: PUBLIC_DEFAULT_LOCALE,
    locales: PUBLIC_LOCALES.split(','),
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
