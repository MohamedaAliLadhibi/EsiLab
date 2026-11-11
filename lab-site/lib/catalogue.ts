export const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.esilab-tn.com/api';

type ProductPayload = {
  id: string;
  slug: string;
  supplier_id?: string;
  supplier?: string;
  data?: Record<string, unknown>;
};

type ProductsResponse = {
  data?: ProductPayload[];
  pagination?: {
    total?: number;
  };
  meta?: {
    total?: number;
  };
};

export type HomeProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  excerpt: string;
  description: string;
  sku?: string;
  image: string;
  heroImage?: string;
};

const featuredSearches = [
  {
    search: '4250',
    slug: 'cryoscope-model-4250',
    image: '/generated/home/product-cryoscope-4250.png',
    heroImage: '/generated/home/hero-cryoscope-4250.png',
  },
  {
    search: '5430',
    slug: 'cent-5430-knob-30x2ml-at-rtr-230v',
    image: '/generated/home/product-centrifuge-5430.png',
  },
  {
    search: 'UN55',
    slug: 'universal-oven-un55-natural-convection-with-singledisplay-53-l-working-temperature-range-at-least-5-c-above-ambient-temperature-to-300-c-setting-temperature-range-20-c',
    image: '/generated/home/product-oven-un55.png',
  },
];

function getText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function shorten(text: string, max = 170) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function cleanProductName(name: string) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .trim();
}

function toHomeProduct(product: ProductPayload, image: string, heroImage?: string): HomeProduct {
  const data = product.data ?? {};
  const name = cleanProductName(getText(data.name) || getText(data.product_name) || product.slug);
  const shortDescription =
    getText(data.short_description) ||
    getText(data.description) ||
    getText(data.summary) ||
    getText(data.package_size);

  return {
    id: product.id,
    slug: product.slug,
    name,
    brand: getText(data.brand) || getText(data.supplier) || getText(product.supplier) || 'ESILAB',
    category: getText(data.category) || 'Catalogue laboratoire',
    excerpt: shorten(shortDescription || 'Référence catalogue disponible sur demande de devis et accompagnement technique.'),
    description: shorten(getText(data.description) || shortDescription || name, 220),
    sku: getText(data.sku) || undefined,
    image,
    heroImage,
  };
}

async function fetchProducts(search: string, limit = 6) {
  const params = new URLSearchParams({
    page: '1',
    limit: String(limit),
    search,
  });

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products for search "${search}" (${response.status})`);
  }

  return (await response.json()) as ProductsResponse;
}

async function fetchActiveProductCount() {
  const response = await fetch(`${API_BASE_URL}/products/summary`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Failed to fetch catalogue summary (${response.status})`);
  const result = await response.json() as { totalProducts?: number };
  return Number(result.totalProducts) || 0;
}

export async function getHomePageCatalogue() {
  let responses: ProductsResponse[];
  let totalProducts: number;
  try {
    [responses, totalProducts] = await Promise.all([
      Promise.all(featuredSearches.map((entry) => fetchProducts(entry.search))),
      fetchActiveProductCount(),
    ]);
  } catch (error) {
    // Keep the marketing site buildable and available if the API/database is
    // temporarily offline. Next.js will retry after the page revalidation window.
    console.warn('Home catalogue unavailable; rendering the page without live products.', error);
    return {
      totalProducts: 0,
      featuredBrands: [],
      featuredProducts: [],
      heroProduct: null,
    };
  }

  const featuredProducts = featuredSearches
    .map((entry, index) => {
      const candidates = responses[index]?.data ?? [];
      const exact = candidates.find((candidate) => candidate.slug === entry.slug);
      const picked = exact ?? candidates[0];

      if (!picked) return null;

      return toHomeProduct(picked, entry.image, entry.heroImage);
    })
    .filter((product): product is HomeProduct => product !== null);

  const featuredBrands = Array.from(new Set(featuredProducts.map((product) => product.brand))).filter(Boolean);

  return {
    totalProducts,
    featuredBrands,
    featuredProducts,
    heroProduct: featuredProducts[0] ?? null,
  };
}
