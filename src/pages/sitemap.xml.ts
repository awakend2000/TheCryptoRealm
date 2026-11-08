import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// If you ever move to your own domain, change this one line.
const SITE = 'https://thecryptorealm.pages.dev';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const pages = ['/', '/about/', '/trade/', '/nfts/', '/disclaimer/', '/articles/'];

  const pageUrls = pages.map((path) => `  <url><loc>${SITE}${path}</loc></url>`);

  const articleUrls = articles.map((article) => {
    const lastmod = article.data.date.toISOString().split('T')[0];
    return `  <url><loc>${SITE}/articles/${article.id}/</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pageUrls, ...articleUrls].join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
