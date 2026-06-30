import { MetadataRoute } from 'next';

import { getAllPosts } from '@/features/blog/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bookyourcounselling.com';

  const routes = [
    '',
    '/about',
    '/academic-counsellor',
    '/apply-counsellor',
    '/blog',
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

  const posts = await getAllPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes];
}
