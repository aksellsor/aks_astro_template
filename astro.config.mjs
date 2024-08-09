import { defineConfig } from 'astro/config';

// Fix for querying local Umbraco project
import cloudflare from '@astrojs/cloudflare';
import react from "@astrojs/react";
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()]
});