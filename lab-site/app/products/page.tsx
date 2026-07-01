'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Microscope,
  Package,
  Ruler,
  ScanSearch,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

type Product = {
  id: number;
  slug: string;
  name: string;
  sku?: string;
  category?: string;
  category_id?: number;
  supplier?: string;
  data: Record<string, unknown>;
};

type ApiProductsResponse = {
  data: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ProductGroup = {
  slug: string;
  name: string;
  summary: string;
  keywords: string[];
  icon: typeof Microscope;
  accent: string;
  chip: string;
  surface: string;
};

const productGroups: ProductGroup[] = [
  {
    slug: 'equipements-laboratoires',
    name: 'Equipements Laboratoires',
    summary:
      'Instrumentation, centrifugation, hotte, microbiologie et solutions completes pour laboratoires scientifiques.',
    keywords: [
      'equipement',
      'equipment',
      'instrument',
      'instrumentation',
      'centrifuge',
      'centrifugation',
      'hotte',
      'biosafety',
      'cabinet',
      'microbiologie',
      'microbiology',
      'oven',
      'incubator',
      'laboratoire',
    ],
    icon: Microscope,
    accent: 'from-blue to-cyan',
    chip: 'border-blue/25 bg-blue/5 text-blue',
    surface: 'border-blue/20 bg-blue/5',
  },
  {
    slug: 'metrologie-dimensionnelle',
    name: 'Metrologie Dimensionnelle',
    summary:
      'Mesure, controle dimensionnel et verification de precision pour les environnements exigeants.',
    keywords: [
      'metrologie',
      'metrology',
      'dimension',
      'dimensionnel',
      'mesure',
      'measure',
      'controle',
      'precision',
      'caliper',
      'micrometer',
      'gauge',
      'verification',
      'viscometer',
      'viscosimetre',
      'analyzer',
      'analyseur',
      'cryoscope',
    ],
    icon: Ruler,
    accent: 'from-cyan to-lime',
    chip: 'border-cyan/25 bg-cyan/5 text-cyan',
    surface: 'border-cyan/20 bg-cyan/5',
  },
  {
    slug: 'inspection-emballage',
    name: 'Inspection & Emballage',
    summary:
      'Controle qualite, inspection visuelle et solutions industrielles de conditionnement et tracabilite.',
    keywords: [
      'inspection',
      'emballage',
      'packaging',
      'conditionnement',
      'tracabilite',
      'traceability',
      'visual',
      'vision',
      'quality',
      'qualite',
      'controle qualite',
      'industrial',
      'industriel',
      'lot',
    ],
    icon: ScanSearch,
    accent: 'from-lime to-orange',
    chip: 'border-lime/30 bg-lime/10 text-lime',
    surface: 'border-lime/25 bg-lime/10',
  },
  {
    slug: 'produits-chimiques-reactifs',
    name: 'Produits Chimiques & Reactifs',
    summary:
      'Reactifs, consommables et produits de laboratoire adaptes aux usages de routine et de recherche.',
    keywords: [
      'chimique',
      'chemical',
      'reactif',
      'reagent',
      'consommable',
      'consumable',
      'cas',
      'solution',
      'buffer',
      'kit',
      'media',
      'milieu',
      'routine',
      'research',
      'recherche',
    ],
    icon: FlaskConical,
    accent: 'from-orange to-scarlet',
    chip: 'border-orange/25 bg-orange/5 text-orange',
    surface: 'border-orange/20 bg-orange/5',
  },
];

const productFamilyImages = [
  {
    test: (text: string) => /calibration weight|test weight|weight set|350-82/i.test(text),
    url: 'https://www.precisa.com/wp-content/uploads/2021/07/Precisa_Balances_360_EP_6200C-4.jpg',
  },
  {
    test: (text: string) => /\b520\s+(PB|PT)\b|520 PB\/PT|carat bowl|LP4024|power splitter|anti-theft/i.test(text),
    url: 'https://www.precisa.com/wp-content/uploads/2023/08/DSCF2762-Retouched-300x200.jpg',
  },
  {
    test: (text: string) => /\b321\s+(LS|LT|LX)\b|321 LT\/LX\/LS|\bLT\s+\d|\bLS\s+\d|\bLX\s+\d/i.test(text),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LX-Range.png',
  },
  {
    test: (text: string) => /\b(320|330|335|390|490)\b|balance|data cable|RJ45|adapter|interface|remote|secondary display|protective cover|night cover|printer|barcode|smartbox/i.test(text),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LS-Range.png',
  },
  {
    test: (text: string) => /(^|\s)360\s+EP|\bEP\s+\d/i.test(text),
    url: 'https://www.precisa.com/wp-content/uploads/2021/07/Precisa_Balances_360_EP_6200C-4.jpg',
  },
  {
    test: (text: string) => /\bFLM300\b|ALP|cuvette|pipet/i.test(text),
    url: 'https://www.novabiomedical.com/up/assets/2023/08/FLM300_220x260.png',
  },
  {
    test: (text: string) => /\b4250\b|cryoscope|lactrol|calibration standard/i.test(text),
    url: 'https://www.novabiomedical.com/up/assets/2019/12/4250-Cryoscope_New_Logo_220x260_Isolated.png',
  },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    const group = searchParams.get('group');
    setSelectedGroup(productGroups.some((item) => item.slug === group) ? group : null);
  }, [searchParams]);

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '24',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`${API_BASE}/products?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiProductsResponse = await res.json();
      const pagination = json.pagination ?? json.meta;
      setProducts(json.data ?? []);
      setTotalPages(pagination?.totalPages ?? 1);
      setTotal(pagination?.total ?? 0);
    } catch (e) {
      setError('Impossible de charger les produits. Vérifiez que le serveur API est démarré.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedGroup]);

  const clearSearch = () => {
    setSearch('');
    searchRef.current?.focus();
  };

  const handleGroupSelect = (slug: string | null) => {
    setSelectedGroup(slug);
    setFiltersOpen(false);
  };

  // Extract a display-friendly field from product.data
  const getField = (product: Product, ...keys: string[]) => {
    for (const key of keys) {
      const val = product.data?.[key] ?? (product as Record<string, unknown>)[key];
      if (val && typeof val === 'string') return val;
    }
    return null;
  };

  const getProductText = (product: Product) => {
    const fields = [
      product.name,
      product.category,
      product.supplier,
      product.sku,
      ...Object.values(product.data ?? {}).filter((value): value is string => typeof value === 'string'),
    ];
    return fields.join(' ').toLowerCase();
  };

  const getProductImage = (product: Product) => {
    const image = getField(product, 'image_url', 'image', 'photo', 'picture');
    if (image) return image;

    const text = getProductText(product);
    return productFamilyImages.find((family) => family.test(text))?.url ?? null;
  };

  const classifyProduct = (product: Product) => {
    const text = getProductText(product);
    return productGroups.find((group) => group.keywords.some((keyword) => text.includes(keyword)));
  };

  const visibleProducts = selectedGroup
    ? products.filter((product) => classifyProduct(product)?.slug === selectedGroup)
    : products;

  const activeGroup = productGroups.find((group) => group.slug === selectedGroup) ?? null;

  return (
    <main className="min-h-screen bg-panel">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-hero-mesh py-16 text-white lg:py-20">
        <div className="panel-grid absolute inset-0 opacity-20" />
        <div className="site-shell relative">
          <div className="max-w-3xl">
            <p className="eyebrow text-cyan">Catalogue EsiLab</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight lg:text-6xl">
              Produits et solutions pour laboratoires exigeants
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              Trouvez rapidement les équipements, instruments de mesure, solutions
              d'inspection et réactifs adaptés à vos workflows scientifiques et industriels.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">{total || '...'}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">Références</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">4</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">Univers métier</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">SAV</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/55">Conseil & support</p>
            </div>
          </div>
        </div>
      </div>

      <div className="site-shell py-12">
        <section className="grid gap-4 lg:grid-cols-4">
          {productGroups.map((group) => {
            const Icon = group.icon;
            const isActive = selectedGroup === group.slug;

            return (
              <button
                key={group.slug}
                type="button"
                onClick={() => handleGroupSelect(isActive ? null : group.slug)}
                className={`group flex min-h-[17rem] flex-col rounded-2xl border bg-white p-5 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-halo ${
                  isActive ? group.surface : 'border-line/80'
                }`}
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${group.accent} text-white shadow-soft`}>
                  <Icon size={22} />
                </span>
                <h2 className="mt-5 text-xl font-semibold leading-tight text-ink">{group.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{group.summary}</p>
                <span className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${group.chip}`}>
                  {isActive ? 'Catégorie active' : 'En savoir plus'}
                  <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </section>

        {/* Search + Filter Bar */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, une marque, une référence…"
              className="w-full rounded-xl border border-line bg-cloud py-3.5 pl-11 pr-10 text-sm text-ink placeholder:text-slate-400 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-ink transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-blue sm:hidden"
          >
            <SlidersHorizontal size={16} />
            Catégories
            {selectedGroup !== null && (
              <span className="ml-1 rounded-full bg-blue px-2 py-0.5 text-xs text-white">1</span>
            )}
          </button>
        </div>

        <div className="mt-8 flex gap-10">
          {/* Sidebar — categories */}
          <aside
            className={`${
              filtersOpen ? 'block' : 'hidden'
            } w-full shrink-0 sm:block sm:w-72`}
          >
            <div className="sticky top-6 rounded-2xl border border-line bg-white p-5 shadow-soft">
              <p className="eyebrow mb-4 text-slate-400">Univers produits</p>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleGroupSelect(null)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                      selectedGroup === null
                        ? 'bg-blue text-white font-semibold'
                        : 'text-slate-600 hover:bg-mist hover:text-ink'
                    }`}
                  >
                    <Boxes size={16} />
                    Tous les produits
                  </button>
                </li>
                {productGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <li key={group.slug}>
                      <button
                        onClick={() => handleGroupSelect(group.slug)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                          selectedGroup === group.slug
                            ? 'bg-blue text-white font-semibold'
                            : 'text-slate-600 hover:bg-mist hover:text-ink'
                        }`}
                      >
                        <Icon size={16} className="mt-0.5 shrink-0" />
                        <span>{group.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Sparkles size={16} className="text-cyan" />
                  Besoin d'aide ?
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Notre équipe peut orienter votre choix selon votre application, vos contraintes et votre budget.
                </p>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="min-w-0 flex-1">
            {/* Results count + active filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {!loading && (
                <p className="text-sm text-slate-500">
                  {visibleProducts.length > 0 ? (
                    <>
                      <span className="font-semibold text-ink">{selectedGroup ? visibleProducts.length : total}</span> produit{(selectedGroup ? visibleProducts.length : total) > 1 ? 's' : ''} affiché{(selectedGroup ? visibleProducts.length : total) > 1 ? 's' : ''}
                    </>
                  ) : (
                    'Aucun produit trouvé'
                  )}
                </p>
              )}
              {debouncedSearch && (
                <span className="flex items-center gap-1 rounded-full border border-blue/30 bg-blue/5 px-3 py-1 text-xs text-blue">
                  "{debouncedSearch}"
                  <button onClick={clearSearch} aria-label="Effacer la recherche"><X size={12} /></button>
                </span>
              )}
              {activeGroup && (
                <span className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${activeGroup.chip}`}>
                  {activeGroup.name}
                  <button onClick={() => handleGroupSelect(null)} aria-label="Retirer la catégorie"><X size={12} /></button>
                </span>
              )}
            </div>

            {activeGroup && (
              <div className={`mb-6 rounded-2xl border p-5 ${activeGroup.surface}`}>
                <p className="eyebrow text-slate-400">Catégorie sélectionnée</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{activeGroup.name}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{activeGroup.summary}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-scarlet/20 bg-scarlet/5 px-5 py-4 text-sm text-scarlet">
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border border-line bg-white p-5">
                    <div className="h-32 rounded-xl bg-slate-100" />
                    <div className="mt-4 h-3 w-1/3 rounded bg-slate-100" />
                    <div className="mt-3 h-5 w-3/4 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                    <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Products */}
            {!loading && visibleProducts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const name = getField(product, 'name', 'nom', 'product_name', 'title') ?? product.name ?? 'Produit';
                  const sku = getField(product, 'sku', 'reference', 'ref', 'code') ?? product.sku;
                  const brand = getField(product, 'brand', 'marque', 'supplier', 'fabricant') ?? product.supplier;
                  const description = getField(product, 'short_description', 'description', 'excerpt', 'summary', 'details');
                  const rawCategory = getField(product, 'category', 'categorie', 'category_name') ?? product.category;
                  const image = getProductImage(product);
                  const group = classifyProduct(product) ?? productGroups[0];
                  const Icon = group.icon;

                  return (
                    <a
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group flex overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft transition hover:-translate-y-1 hover:border-blue/35 hover:shadow-halo"
                    >
                      <article className="flex w-full flex-col">
                        <div className={`relative flex h-40 items-center justify-center border-b border-line/70 ${group.surface}`}>
                          <div className="panel-grid absolute inset-0 opacity-50" />
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="relative z-10 max-h-32 max-w-[80%] object-contain drop-shadow-md"
                            />
                          ) : (
                            <span className={`relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${group.accent} text-white shadow-soft`}>
                              <Icon size={30} />
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${group.chip}`}>
                              <Icon size={12} />
                              {group.name}
                            </span>
                            {rawCategory && rawCategory !== group.name && (
                              <span className="rounded-full border border-line bg-mist px-2.5 py-1 text-xs text-slate-500">
                                {rawCategory}
                              </span>
                            )}
                          </div>

                          {brand && (
                            <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              <BadgeCheck size={13} />
                              {brand}
                            </p>
                          )}

                          <h3 className="mt-2 text-lg font-semibold leading-snug text-ink transition group-hover:text-blue line-clamp-2">
                            {name}
                          </h3>

                          {description && (
                            <p className="mt-3 flex-1 text-sm leading-6 text-slate-500 line-clamp-3">
                              {description}
                            </p>
                          )}

                          <div className="mt-5 flex items-center justify-between gap-3">
                            {sku ? (
                              <p className="truncate text-xs font-mono text-slate-400">Réf. {sku}</p>
                            ) : (
                              <span className="text-xs text-slate-300">Détails disponibles</span>
                            )}
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue/20 text-blue transition group-hover:bg-blue group-hover:text-white">
                              <ArrowRight size={16} />
                            </span>
                          </div>
                        </div>
                      </article>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {!loading && visibleProducts.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full border border-line bg-white p-6 shadow-soft">
                  <Package size={32} className="text-slate-300" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">Aucun produit trouvé</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs">
                  Essayez de modifier votre recherche ou de changer de catégorie.
                </p>
                <button
                  onClick={() => { setSearch(''); handleGroupSelect(null); }}
                  className="mt-6 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft hover:border-blue hover:text-blue transition"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !selectedGroup && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:border-blue hover:text-blue disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} /> Précédent
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 py-2.5 text-sm text-slate-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`min-w-[2.5rem] rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                            page === p
                              ? 'border-blue bg-blue text-white shadow-soft'
                              : 'border-line bg-white text-ink shadow-soft hover:border-blue hover:text-blue'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:border-blue hover:text-blue disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
