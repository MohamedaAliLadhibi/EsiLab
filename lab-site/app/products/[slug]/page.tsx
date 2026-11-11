'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bot,
  Box,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Layers,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import { DownloadTechnicalSheetButton } from '@/components/landing/DownloadTechnicalSheetButton';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.esilab-tn.com/api';

const QUOTE_EMAIL = 'contact.esilab@esilab.tn';
const QUOTE_WHATSAPP_NUMBER = '21650601783';

type FieldMeta = {
  field_key: string;
  field_label: string;
  field_type: string;
  sort_order: number;
};

type Product = {
  id: string;
  supplier_id: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  data: Record<string, unknown>;
  _fieldMeta: Record<string, FieldMeta>;
  related_variants?: Array<{
    id: string;
    slug: string;
    data: Record<string, unknown>;
  }>;
  related_variants_total?: number;
};

type ProductChatMessage = {
  role: 'assistant' | 'user';
  text: string;
  links?: Array<{ label: string; href: string }>;
};

const hiddenSpecKeys = new Set([
  'name', 'description', 'short_description', 'image_url', 'technical_specs',
  'product_family_key', 'product_family_name', 'variant_attributes', 'manufacturer_url',
  'datasheet_url', 'information_sources', 'enrichment_status', 'equivalent_sku',
  'equivalent_product_id', 'category_slug', 'enrichment_generated_name',
  'enrichment_generated_short_description', 'model_code',
]);

const productFamilyImages = [
  {
    test: (data: Record<string, unknown>) => /\b520\s+(PB|PT)\b|520 PB\/PT|carat bowl|LP4024|power splitter|anti-theft/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2023/08/DSCF2762-Retouched-300x200.jpg',
  },
  {
    test: (data: Record<string, unknown>) => /\b321\s+(LS|LT|LX)\b|321 LT\/LX\/LS|\bLT\s+\d|\bLS\s+\d|\bLX\s+\d/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LX-Range.png',
  },
  {
    test: (data: Record<string, unknown>) => /\b(320|330|335|390|490)\b|balance|data cable|RJ45|adapter|interface|remote|secondary display|protective cover|night cover|printer|barcode|smartbox/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LS-Range.png',
  },
  {
    test: (data: Record<string, unknown>) => /(^|\s)360\s+EP|\bEP\s+\d/i.test(`${data.category ?? ''} ${data.name ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2021/07/Precisa_Balances_360_EP_6200C-4.jpg',
  },
  {
    test: (data: Record<string, unknown>) => /\bFLM300\b|ALP|cuvette|pipet/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.novabiomedical.com/inc/uploads/2019/12/FLM3000_800x554_New_Logo.png',
  },
  {
    test: (data: Record<string, unknown>) => /\b4250\b|cryoscope|lactrol|calibration standard/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.novabiomedical.com/inc/uploads/2019/12/4250-Cryoscope_New_Logo_800x544_Isolated.png',
  },
];

function getDisplayValue(data: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = key.split('.').reduce<unknown>((current, part) => (
      current && typeof current === 'object' ? (current as Record<string, unknown>)[part] : undefined
    ), data);
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
}

function getProductImage(data: Record<string, unknown>) {
  const imageUrl = getDisplayValue(data, 'image_url', 'image', 'photo', 'picture');
  if (imageUrl) return imageUrl;
  if (/^350-869[45]$/.test(getDisplayValue(data, 'sku')) && /protection IP65/i.test(getDisplayValue(data, 'name'))) return '';
  if (/\b(calibration weight|test weight|weight set|masse etalon|poids de calibration)\b/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`)) return '';
  return productFamilyImages.find((family) => family.test(data))?.url ?? '';
}

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    valeur_nominale: 'Valeur nominale',
    plage_du_jeu: 'Plage du jeu',
    classe_de_poids: 'Classe de poids',
    erreur_maximale_admise: 'Erreur maximale admise',
    certificat: 'Certificat',
  };
  if (labels[key]) return labels[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

type ProductAssistantContext = {
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  packageSize: string;
  shortDescription: string;
  description: string;
  data: Record<string, unknown>;
  specFields: Array<{
    field_key: string;
    field_label: string;
    field_type: string;
    sort_order: number;
  }>; 
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuoteChoiceOpen, setIsQuoteChoiceOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/products/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        setProduct(json.data ?? null);
      })
      .catch(() => setError('Produit introuvable ou serveur inaccessible.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (error || !product) return <ErrorState message={error} />;

  const d = product.data;
  const meta = product._fieldMeta;
  const name = getDisplayValue(d, 'name', 'product_name', 'title') || 'Produit';
  const sku = getDisplayValue(d, 'sku', 'reference', 'ref', 'code');
  const brand = getDisplayValue(d, 'brand', 'marque', 'supplier', 'fabricant');
  const category = getDisplayValue(d, 'category', 'categorie', 'category_name');
  const packageSize = getDisplayValue(d, 'package_size', 'conditionnement', 'packaging');
  const shortDescription = getDisplayValue(d, 'short_description', 'summary', 'excerpt');
  const description = getDisplayValue(d, 'description', 'details');
  const imageUrl = getProductImage(d);

  const specFields = Object.keys(d)
    .filter((key) => !hiddenSpecKeys.has(key) && getDisplayValue(d, key))
    .map((key) => ({
      field_key: key,
      field_label: meta[key]?.field_label ?? formatLabel(key),
      field_type: meta[key]?.field_type ?? 'text',
      sort_order: meta[key]?.sort_order ?? 999,
    }))
    .sort((a, b) => a.sort_order - b.sort_order || a.field_label.localeCompare(b.field_label));
  const technicalSpecs = d.technical_specs && typeof d.technical_specs === 'object' && !Array.isArray(d.technical_specs)
    ? d.technical_specs as Record<string, unknown>
    : {};
  for (const [key, value] of Object.entries(technicalSpecs)) {
    if (typeof value !== 'string' && typeof value !== 'number') continue;
    specFields.push({
      field_key: `technical_specs.${key}`,
      field_label: formatLabel(key),
      field_type: 'text',
      sort_order: 1000,
    });
  }
  const getSpecValue = (fieldKey: string) => {
    if (fieldKey.startsWith('technical_specs.')) {
      return getDisplayValue(technicalSpecs, fieldKey.slice('technical_specs.'.length));
    }
    return getDisplayValue(d, fieldKey);
  };
  const manufacturerUrl = getDisplayValue(d, 'manufacturer_url');
  const datasheetUrl = getDisplayValue(d, 'datasheet_url');

  const quickFacts = [
    brand && { label: 'Marque', value: brand, icon: BadgeCheck },
    category && { label: 'Catégorie', value: category, icon: Layers },
    packageSize && { label: 'Conditionnement', value: packageSize, icon: Box },
    sku && { label: 'Référence', value: sku, icon: Tag },
  ].filter(Boolean) as Array<{ label: string; value: string; icon: typeof BadgeCheck }>;

  // Payload for the PDF "Fiche technique"
  const dataSheetProduct = {
    name,
    sku: sku || undefined,
    brand: brand || undefined,
    category: category || undefined,
    packageSize: packageSize || undefined,
    shortDescription: shortDescription || undefined,
    description: description || undefined,
    imageUrl: imageUrl || undefined,
    manufacturerUrl: manufacturerUrl || undefined,
    datasheetUrl: datasheetUrl || undefined,
    specs: specFields
      .map((field) => ({
        label: field.field_label,
        value: getSpecValue(field.field_key),
      }))
      .filter((spec) => spec.value),
  };

  const assistantContext: ProductAssistantContext = {
    slug: product.slug,
    name,
    sku,
    brand,
    category,
    packageSize,
    shortDescription,
    description,
    data: d,
    specFields,
  };
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab-tn.com'}/products/${product.slug}`;
  const quoteLines = [
    'Bonjour ESILAB,',
    '',
    'Je souhaite demander un devis pour ce produit :',
    `Produit : ${name}`,
    sku ? `Référence : ${sku}` : '',
    brand ? `Marque : ${brand}` : '',
    category ? `Catégorie : ${category}` : '',
    packageSize ? `Conditionnement : ${packageSize}` : '',
    `Lien produit : ${currentUrl}`,
    '',
    'Merci de me confirmer le prix, la disponibilité et les délais.',
  ].filter(Boolean);
  const quoteMessage = quoteLines.join('\n');
  const quoteSubject = `Demande de devis - ${sku || name}`;
  const emailHref = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(quoteSubject)}&body=${encodeURIComponent(quoteMessage)}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(QUOTE_EMAIL)}&su=${encodeURIComponent(quoteSubject)}&body=${encodeURIComponent(quoteMessage)}`;
  const whatsappHref = `https://wa.me/${QUOTE_WHATSAPP_NUMBER}?text=${encodeURIComponent(quoteMessage)}`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || shortDescription || name,
    sku: sku || undefined,
    category: category || undefined,
    image: imageUrl || undefined,
    url: currentUrl,
    brand: brand
      ? {
          '@type': 'Brand',
          name: brand,
        }
      : undefined,
    additionalProperty: specFields.slice(0, 20).map((field) => ({
      '@type': 'PropertyValue',
      name: field.field_label,
      value: getDisplayValue(d, field.field_key),
    })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab-tn.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Produits',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab-tn.com'}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name,
        item: currentUrl,
      },
    ],
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Comment utiliser ${name} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: description || shortDescription || `ESILAB peut vous accompagner pour l'utilisation, la mise en service et le choix des accessoires de ${name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Comment demander un devis pour ${name} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Contactez ESILAB avec la référence ${sku || name} afin de confirmer le prix, la disponibilité, les accessoires et les délais.`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-panel">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="bg-white border-b border-line">
        <div className="site-shell py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue transition">Accueil</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue transition">Produits</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate max-w-xs">{name}</span>
        </div>
      </div>

      <div className="site-shell py-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue transition"
        >
          <ArrowLeft size={15} />
          Retour au catalogue
        </Link>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[28rem] overflow-hidden bg-gradient-to-br from-cloud via-white to-mist p-6 sm:p-8">
              <div className="panel-grid absolute inset-0 opacity-70" />
              <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
                {brand && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-white/85 px-3 py-1.5 text-xs font-semibold text-blue backdrop-blur">
                    <BadgeCheck size={13} /> {brand}
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
                    <Layers size={13} /> {category}
                  </span>
                )}
              </div>

              <div className="relative z-0 flex h-full min-h-[24rem] items-center justify-center pt-12">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="max-h-[24rem] max-w-full object-contain drop-shadow-xl"
                    onError={(event) => {
                      (event.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center rounded-[2rem] border border-blue/15 bg-white/80 text-blue shadow-soft backdrop-blur">
                    <Package size={76} strokeWidth={1.25} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {sku && (
                <p className="eyebrow flex items-center gap-2 text-slate-400">
                  <Tag size={13} /> Ref. {sku}
                </p>
              )}

              <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink lg:text-5xl">
                {name}
              </h1>

              {shortDescription && shortDescription !== name && (
                <p className="mt-5 text-base leading-8 text-slate-600 lg:text-lg">{shortDescription}</p>
              )}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {quickFacts.slice(0, 4).map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div key={fact.label} className="rounded-2xl border border-line bg-cloud/70 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <Icon size={14} className="text-blue" />
                        {fact.label}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-ink">{fact.value}</p>
                    </div>
                  );
                })}

                <DownloadTechnicalSheetButton product={dataSheetProduct} variant="tile" />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteChoiceOpen((isOpen) => !isOpen)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-navy"
                >
                  Demander un devis
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue"
                >
                  Parler à un expert
                  <Mail size={16} />
                </Link>
              </div>
              {isQuoteChoiceOpen && (
                <QuoteChoiceCard
                  emailHref={emailHref}
                  gmailHref={gmailHref}
                  whatsappHref={whatsappHref}
                  productName={name}
                />
              )}

              <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Sélection pro</span><br />Matériel catalogue qualifié</p>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardList size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Devis clair</span><br />Référence et besoin repris</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Support local</span><br />Conseil et suivi ESILAB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            {description && description !== shortDescription && description !== name && (
              <section className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <FileText size={20} />
                  </span>
                  <div>
                    <p className="eyebrow text-slate-400">Description</p>
                    <h2 className="mt-1 text-2xl font-semibold text-ink">Presentation du produit</h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-8 text-slate-600">{description}</p>
              </section>
            )}

            {specFields.length > 0 && (
              <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                <div className="border-b border-line px-6 py-5 sm:px-8">
                  <p className="eyebrow text-slate-400">Fiche technique</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">Caractéristiques principales</h2>
                </div>
                <div className="grid sm:grid-cols-2">
                  {specFields.map((field) => {
                    const val = getSpecValue(field.field_key);
                    if (!val) return null;
                    return (
                      <div key={field.field_key} className="border-b border-line px-6 py-4 sm:px-8 sm:odd:border-r">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{field.field_label}</p>
                        {field.field_type === 'image_url' || /^https?:\/\//.test(val) ? (
                          <a href={val} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline">
                            Ouvrir le lien <ExternalLink size={13} />
                          </a>
                        ) : (
                          <p className="mt-2 break-words text-sm font-medium leading-6 text-ink">{val}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {product.related_variants && product.related_variants.length > 0 && (
              <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                <div className="border-b border-line px-6 py-5 sm:px-8">
                  <p className="eyebrow text-slate-400">Même famille produit</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">Autres références et variantes</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Chaque référence reste un produit distinct. Vérifiez les différences de configuration avant de choisir.</p>
                </div>
                <div
                  tabIndex={product.related_variants.length > 4 ? 0 : undefined}
                  aria-label={product.related_variants.length > 4 ? 'Liste défilante des autres références et variantes' : undefined}
                  className={`divide-y divide-line ${product.related_variants.length > 4 ? 'max-h-[26rem] overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/40' : ''}`}
                >
                  {product.related_variants.map((variant) => {
                    const variantName = getDisplayValue(variant.data, 'name') || 'Variante';
                    const variantSku = getDisplayValue(variant.data, 'sku');
                    const attributes = variant.data.variant_attributes && typeof variant.data.variant_attributes === 'object'
                      ? Object.entries(variant.data.variant_attributes as Record<string, unknown>)
                        .map(([key, value]) => `${formatLabel(key)}: ${String(value)}`)
                        .join(' · ')
                      : '';
                    return (
                      <Link key={variant.id} href={`/products/${variant.slug}`} className="block px-6 py-4 transition hover:bg-slate-50 sm:px-8">
                        <span className="text-sm font-semibold text-blue">{variantName}{variantSku ? ` — Réf. ${variantSku}` : ''}</span>
                        {attributes && <span className="mt-1 block text-xs leading-5 text-slate-500">{attributes}</span>}
                      </Link>
                    );
                  })}
                </div>
                {(product.related_variants_total ?? 0) > product.related_variants.length && (
                  <div className="border-t border-line px-6 py-4 sm:px-8">
                    <Link href={`/products?search=${encodeURIComponent(getDisplayValue(d, 'product_family_key'))}`} className="text-sm font-semibold text-blue hover:underline">
                      Voir toutes les références de cette famille ({product.related_variants_total}) <ArrowRight size={14} className="ml-1 inline" />
                    </Link>
                  </div>
                )}
              </section>
            )}

            {(manufacturerUrl || datasheetUrl) && (
              <section className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8">
                <p className="eyebrow text-slate-400">Documentation vérifiée</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">Sources fabricant</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {manufacturerUrl && <a href={manufacturerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-blue hover:bg-slate-50">Page fabricant <ExternalLink size={14} /></a>}
                  {datasheetUrl && <a href={datasheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-blue hover:bg-slate-50">Catalogue / fiche fabricant <ExternalLink size={14} /></a>}
                </div>
              </section>
            )}

            <ProductFaqChat context={assistantContext} />
          </div>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <Sparkles size={20} />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-ink">Accompagnement ESILAB</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Notre équipe peut confirmer la référence, proposer une alternative et préparer une offre adaptée à votre application.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {['Vérification compatibilité', 'Conseil avant achat', 'Suivi SAV et installation'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-lime" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setIsQuoteChoiceOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue"
              >
                Recevoir une offre
                <ArrowRight size={16} />
              </button>
              {isQuoteChoiceOpen && (
                <QuoteChoiceCard
                  emailHref={emailHref}
                  gmailHref={gmailHref}
                  whatsappHref={whatsappHref}
                  productName={name}
                />
              )}
            </section>

            <section className="rounded-[2rem] border border-blue/20 bg-blue/5 p-6">
              <p className="eyebrow text-blue">Info catalogue</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Les disponibilités, accessoires et versions peuvent varier selon le fournisseur. ESILAB confirme les détails avant commande.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function QuoteChoiceCard({
  emailHref,
  gmailHref,
  whatsappHref,
  productName,
}: {
  emailHref: string;
  gmailHref: string;
  whatsappHref: string;
  productName: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-blue/20 bg-blue/5 p-4">
      <p className="text-sm font-semibold text-ink">Choisissez comment envoyer votre demande</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Le message sera préparé automatiquement avec les détails de {productName}.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href={gmailHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue"
        >
          <Mail size={16} />
          Ouvrir Gmail
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1faa52]"
        >
          <MessageCircle size={16} />
          Contacter sur WhatsApp
        </a>
      </div>
      <a
        href={emailHref}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/70 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-blue hover:text-blue"
      >
        Utiliser mon application email
      </a>
    </div>
  );
}

function ProductFaqChat({ context }: { context: ProductAssistantContext }) {
  const starterQuestions = [
    'Comment utiliser ce produit ?',
    'Quelles sont ses spécifications ?',
    'Est-il compatible avec mon besoin ?',
    'Comment demander un devis ?',
  ];
  const [messages, setMessages] = useState<ProductChatMessage[]>([
    {
      role: 'assistant',
      text: `Posez une question sur ${context.name}. Je peux rechercher ses informations dans le catalogue et vous orienter vers le SAV ou l'équipe commerciale.`,
    },
  ]);
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [assistantUnavailable, setAssistantUnavailable] = useState(false);

  const askQuestion = async (value: string) => {
    const trimmedQuestion = value.trim();
    if (!trimmedQuestion || isThinking) return;

    const conversation = [...messages, { role: 'user' as const, text: trimmedQuestion }];
    setMessages(conversation);
    setQuestion('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: context.slug,
          messages: conversation.slice(-8).map(({ role, text }) => ({ role, content: text })),
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Impossible de joindre l’assistant.');
      setAssistantUnavailable(false);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: json.answer, links: json.links || [] },
      ]);
    } catch (error) {
      setAssistantUnavailable(true);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: error instanceof Error ? error.message : 'L’assistant est indisponible. Reessayez dans un instant.' },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
      <div className="border-b border-line bg-gradient-to-r from-blue/10 via-white to-cyan/10 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue text-white shadow-soft">
              <Bot size={21} />
            </span>
            <div>
              <p className="eyebrow text-blue">FAQ intelligente</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">Assistant produit</h2>
            </div>
          </div>
          <span className="rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-cyan">
            {assistantUnavailable ? 'Catalogue indisponible' : 'Réponses catalogue'}
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_16rem]">
        <div className="flex min-h-[24rem] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div key={`${message.role}-${index}`} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
                      <Bot size={16} />
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      isUser
                        ? 'bg-blue text-white'
                        : 'border border-line bg-cloud/80 text-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.links.map((action) => action.href.startsWith('/') ? (
                          <Link key={`${action.href}-${action.label}`} href={action.href} className="inline-flex items-center gap-1 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue transition hover:bg-blue/10">
                            {action.label}<ArrowRight size={13} />
                          </Link>
                        ) : (
                          <a key={`${action.href}-${action.label}`} href={action.href} className="inline-flex items-center gap-1 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold text-blue transition hover:bg-blue/10">
                            {action.label}<ArrowRight size={13} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {isUser && (
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                      <User size={16} />
                    </span>
                  )}
                </div>
              );
            })}
            {isThinking && (
              <div className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <Bot size={16} />
                </span>
                <div className="rounded-2xl border border-line bg-cloud/80 px-4 py-3 text-sm leading-7 text-slate-500">
                  Recherche dans le catalogue...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              askQuestion(question);
            }}
            className="flex gap-3 border-t border-line p-4 sm:p-5"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ex: comment l'utiliser dans mon laboratoire ?"
              className="min-w-0 flex-1 rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue text-white transition hover:bg-navy"
              aria-label="Envoyer la question"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        <aside className="border-t border-line bg-panel p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Questions rapides</p>
          <div className="mt-4 space-y-2">
            {starterQuestions.map((starterQuestion) => (
              <button
                key={starterQuestion}
                type="button"
                onClick={() => askQuestion(starterQuestion)}
                className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-left text-sm font-semibold leading-5 text-ink transition hover:border-blue hover:text-blue"
              >
                {starterQuestion}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Pour les prix, les stocks et les validations importantes, l'assistant oriente vers une confirmation ESILAB.
          </p>
        </aside>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-panel">
      <div className="bg-white border-b border-line h-12" />
      <div className="site-shell py-12">
        <div className="h-5 w-32 rounded bg-slate-100 animate-pulse mb-10" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square rounded-[2.5rem] bg-slate-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
            <div className="h-8 w-3/4 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
            <div className="mt-6 h-48 rounded-[1.5rem] bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <main className="min-h-screen bg-panel flex flex-col items-center justify-center text-center px-6">
      <div className="rounded-full border border-line bg-white p-6 shadow-soft">
        <Package size={32} className="text-slate-300" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-ink">Produit introuvable</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-xs">{message ?? 'Ce produit n\'existe pas ou le serveur est inaccessible.'}</p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft hover:border-blue hover:text-blue transition"
      >
        <ArrowLeft size={14} /> Retour au catalogue
      </Link>
    </main>
  );
}
