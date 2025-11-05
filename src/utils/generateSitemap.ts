// utils/generateSitemap.ts
const generateSitemap = (baseUrl: string = 'https://spatialforce.co.zw') => {
  const pages = [
    '',
    '/about',
    '/services',
    '/services2',
    '/contact',
    '/bookings',
    '/articles-and-projects',
    '/smartcitysolutions',
    '/Artificial-Intelligence',
    '/web-applications',
    '/terms',
    '/privacy',
    '/reviews'
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;
};

export default generateSitemap;