import client from '../umbraco-client';

const siteUrl = import.meta.env.PUBLIC_SITE_URL;
const LOCALES = import.meta.env.PUBLIC_LOCALES?.split(',');
const NOT_DEFAULT_LOCALES = import.meta.env.PUBLIC_OTHER_LOCALES?.split(',');
export async function GET() {
  const dynamicRoutes = await fetchDynamicRoutes(); // Function to fetch dynamic routes

  const urls = [
    `<url><loc>${siteUrl}</loc></url>`,
    ...NOT_DEFAULT_LOCALES?.map(
      (langcode) => `<url><loc>${siteUrl}/${langcode}</loc></url>`,
    ),
    ...dynamicRoutes.map((route) => {
      return `<url><loc>${siteUrl}${route}</loc></url>`;
    }),
  ].join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// Example function to fetch dynamic routes from an API or CMS
async function fetchDynamicRoutes() {
  let allPageUrls = [];

  // Loop through each locale
  for (const locale of LOCALES) {
    // Fetch URLs for the current locale
    const data = await client.getAllUrls(locale);

    // Extract page URLs for this locale
    const pageUrls = extractPageUrls(data);

    // Add the extracted URLs to the allPageUrls array
    allPageUrls = allPageUrls.concat(pageUrls);
  }

  return allPageUrls;
}
function extractPageUrls(data) {
  return data?.items
    ?.filter((p) => !p.properties?.hideFromSitemap)
    ?.map((page) => page.route.path);
}
