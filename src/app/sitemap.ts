import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bookyourcounselling.com';

  const routes = [
    '',
    '/about',
    '/academic-counsellor',
    '/apply-counsellor',
    '/booking',
    '/how-it-works',
    '/privacy',
    '/school-to-startup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // You can also fetch dynamic routes (e.g., individual mentor profiles, blog posts) here
  // and append them to the sitemap array.

  return [...routes];
}
