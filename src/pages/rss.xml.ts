import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// If you ever move to your own domain, change this one line.
const SITE = 'https://thecryptorealm.pages.dev';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 20);

  const items = articles.map((a) => {
    const url = `${SITE}/articles/${a.id}/`;
    return `    <item>
      <title>${esc(a.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${a.data.date.toUTCString()}</pubDate>
      <description>${esc(a.data.description)}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The Crypto Realm</title>
    <link>${SITE}/</link>
    <description>Independent voices. Decentralized ideas.</description>
    <language>en</language>
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
