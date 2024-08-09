import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { qrcode } from 'vite-plugin-qrcode';

// Fix SSL umbraco api locally
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export default defineConfig({
  vite: {
    plugins: [
      qrcode({
        // filter: (url) => url === 'http://192.168.199.231:4321/'
      }),
    ],
  },
  integrations: [react()],
  output: 'server',
  adapter: cloudflare({ imageService: 'noop' }),
});
