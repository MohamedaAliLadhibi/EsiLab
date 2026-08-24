import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn';
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Static pages – these never change
const staticRoutes = [
  { path: '/', priority: 1.0 },
  { path: '/products', priority: 0.95 },
  { path: '/solutions', priority: 0.85 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.75 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static entries
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route.priority,
  }));

  // 2. Product entries – fetch from API
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    // Fetch up to 5000 products (adjust limit if needed)
    const response = await fetch(`${apiBase}/products?limit=5000`, {
      next: { revalidate: 86400 }, // regenerate once per day
    });

    if (!response.ok) {
      console.warn(`Sitemap: API returned ${response.status}, falling back to empty product list`);
      return [...staticEntries]; // fallback: only static pages
    }

    const json = await response.json();
    const products = json.data || [];

    productEntries = products.map((product: any) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    console.log(`✅ Sitemap generated: ${staticEntries.length} static + ${productEntries.length} product entries`);
  } catch (error) {
    console.error('❌ Sitemap product fetch failed:', error);
    // Return static pages only – better than failing entirely
    return [...staticEntries];
  }

  return [...staticEntries, ...productEntries];
}