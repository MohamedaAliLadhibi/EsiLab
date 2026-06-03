import type { MetadataRoute } from 'next';
import { featuredProducts } from '@/lib/site-data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/products', priority: 0.95 },
    { path: '/solutions', priority: 0.85 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.75 },
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route.priority,
  }));

  const productEntries = featuredProducts.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...productEntries];
}
