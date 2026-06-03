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
  Package,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

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
  data: Record<string, string>;
  _fieldMeta: Record<string, FieldMeta>;
};

type ProductChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

const hiddenSpecKeys = new Set(['name', 'description', 'short_description', 'image_url']);

const productFamilyImages = [
  {
    test: (data: Record<string, string>) => /calibration weight|test weight|weight set|350-82/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2021/07/Precisa_Balances_360_EP_6200C-4.jpg',
  },
  {
    test: (data: Record<string, string>) => /\b520\s+(PB|PT)\b|520 PB\/PT|carat bowl|LP4024|power splitter|anti-theft/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2023/08/DSCF2762-Retouched-300x200.jpg',
  },
  {
    test: (data: Record<string, string>) => /\b321\s+(LS|LT|LX)\b|321 LT\/LX\/LS|\bLT\s+\d|\bLS\s+\d|\bLX\s+\d/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LX-Range.png',
  },
  {
    test: (data: Record<string, string>) => /\b(320|330|335|390|490)\b|balance|data cable|RJ45|adapter|interface|remote|secondary display|protective cover|night cover|printer|barcode|smartbox/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2018/04/Precisa-321-LS-Range.png',
  },
  {
    test: (data: Record<string, string>) => /(^|\s)360\s+EP|\bEP\s+\d/i.test(`${data.category ?? ''} ${data.name ?? ''}`),
    url: 'https://www.precisa.com/wp-content/uploads/2021/07/Precisa_Balances_360_EP_6200C-4.jpg',
  },
  {
    test: (data: Record<string, string>) => /\bFLM300\b|ALP|cuvette|pipet/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.novabiomedical.com/up/assets/2023/08/FLM300_220x260.png',
  },
  {
    test: (data: Record<string, string>) => /\b4250\b|cryoscope|lactrol|calibration standard/i.test(`${data.sku ?? ''} ${data.name ?? ''} ${data.category ?? ''}`),
    url: 'https://www.novabiomedical.com/up/assets/2019/12/4250-Cryoscope_New_Logo_220x260_Isolated.png',
  },
];

function getDisplayValue(data: Record<string, string>, ...keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function getProductImage(data: Record<string, string>) {
  const imageUrl = getDisplayValue(data, 'image_url', 'image', 'photo', 'picture');
  if (imageUrl) return imageUrl;
  return productFamilyImages.find((family) => family.test(data))?.url ?? '';
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function answerProductQuestion(question: string, context: ProductAssistantContext) {
  const normalizedQuestion = question.toLowerCase();
  const specLines = context.specFields
    .slice(0, 8)
    .map((field) => `${field.field_label}: ${getDisplayValue(context.data, field.field_key)}`)
    .filter(Boolean);

  if (/use|utilis|mode|comment|operate|installer|install|start|demarr|fonction/i.test(normalizedQuestion)) {
    return [
      `Pour utiliser ${context.name}, commencez par confirmer la reference ${context.sku || 'du produit'} et son application avec votre procedure interne.`,
      context.description || context.shortDescription
        ? `D'apres la fiche, ${context.description || context.shortDescription}`
        : 'La fiche ne donne pas encore de mode operatoire detaille.',
      'Pour une utilisation en laboratoire, EsiLab peut vous aider avec le choix, la mise en service, la formation et les accessoires compatibles.',
    ].join(' ');
  }

  if (/spec|fiche|caracter|capacity|capacite|size|dimension|detail|technical|technique/i.test(normalizedQuestion)) {
    return specLines.length
      ? `Voici les points techniques disponibles pour ${context.name}: ${specLines.join('; ')}.`
      : `La fiche de ${context.name} ne contient pas encore de specifications detaillees. Le mieux est de demander une confirmation EsiLab avec la reference ${context.sku || context.name}.`;
  }

  if (/price|prix|devis|cost|cout|commande|acheter|buy|availability|disponib/i.test(normalizedQuestion)) {
    return `Pour le prix, la disponibilite et les delais de ${context.name}, il faut demander un devis EsiLab. La reference a transmettre est ${context.sku || context.name}${context.packageSize ? `, conditionnement ${context.packageSize}` : ''}.`;
  }

  if (/compatible|compatibil|accessoire|accessory|alternative|replace|remplace|spare|piece/i.test(normalizedQuestion)) {
    return `Pour verifier la compatibilite de ${context.name}, il faut croiser la reference ${context.sku || 'produit'}, la famille ${context.category || 'catalogue'} et votre equipement actuel. EsiLab peut confirmer l'accessoire, une alternative ou une piece equivalente avant commande.`;
  }

  if (/brand|marque|supplier|fabricant|category|categorie|family|famille/i.test(normalizedQuestion)) {
    return `${context.name} est classe dans ${context.category || 'le catalogue EsiLab'}${context.brand ? ` et associe a la marque ${context.brand}` : ''}${context.sku ? `. Reference: ${context.sku}` : ''}.`;
  }

  return [
    `Je peux vous aider sur ${context.name} avec les informations de cette fiche catalogue.`,
    context.shortDescription && context.shortDescription !== context.name ? context.shortDescription : '',
    specLines.length ? `Quelques donnees utiles: ${specLines.slice(0, 4).join('; ')}.` : '',
    'Pour une reponse engageante sur compatibilite, prix ou disponibilite, envoyez une demande a EsiLab.',
  ].filter(Boolean).join(' ');
}

type ProductAssistantContext = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  packageSize: string;
  shortDescription: string;
  description: string;
  data: Record<string, string>;
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

  const quickFacts = [
    brand && { label: 'Marque', value: brand, icon: BadgeCheck },
    category && { label: 'Univers', value: category, icon: Layers },
    packageSize && { label: 'Conditionnement', value: packageSize, icon: Box },
    sku && { label: 'Reference', value: sku, icon: Tag },
  ].filter(Boolean) as Array<{ label: string; value: string; icon: typeof BadgeCheck }>;

  const assistantContext: ProductAssistantContext = {
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
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn'}/products/${product.slug}`;
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
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Produits',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.esilab.tn'}/products`,
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
          text: description || shortDescription || `EsiLab peut vous accompagner pour l utilisation, la mise en service et le choix des accessoires de ${name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Comment demander un devis pour ${name} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Contactez EsiLab avec la reference ${sku || name} afin de confirmer le prix, la disponibilite, les accessoires et les delais.`,
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
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/contact?product=${encodeURIComponent(name)}${sku ? `&sku=${encodeURIComponent(sku)}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-navy"
                >
                  Demander un devis
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue"
                >
                  Parler a un expert
                  <Mail size={16} />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Selection pro</span><br />Materiel catalogue qualifie</p>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardList size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Devis clair</span><br />Reference et besoin repris</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-cyan" />
                  <p className="text-sm leading-6 text-slate-500"><span className="font-semibold text-ink">Support local</span><br />Conseil et suivi EsiLab</p>
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
                  <h2 className="mt-2 text-2xl font-semibold text-ink">Caracteristiques principales</h2>
                </div>
                <div className="grid sm:grid-cols-2">
                  {specFields.map((field) => {
                    const val = getDisplayValue(d, field.field_key);
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

            <ProductFaqChat context={assistantContext} />
          </div>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <Sparkles size={20} />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-ink">Accompagnement EsiLab</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Notre equipe peut confirmer la reference, proposer une alternative et preparer une offre adaptee a votre application.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {['Verification compatibilite', 'Conseil avant achat', 'Suivi SAV et installation'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-lime" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?product=${encodeURIComponent(name)}${sku ? `&sku=${encodeURIComponent(sku)}` : ''}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue"
              >
                Recevoir une offre
                <ArrowRight size={16} />
              </Link>
            </section>

            <section className="rounded-[2rem] border border-blue/20 bg-blue/5 p-6">
              <p className="eyebrow text-blue">Info catalogue</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Les disponibilites, accessoires et versions peuvent varier selon fournisseur. EsiLab confirme les details avant commande.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ProductFaqChat({ context }: { context: ProductAssistantContext }) {
  const starterQuestions = [
    'Comment utiliser ce produit ?',
    'Quelles sont ses specifications ?',
    'Est-il compatible avec mon besoin ?',
    'Comment demander un devis ?',
  ];
  const [messages, setMessages] = useState<ProductChatMessage[]>([
    {
      role: 'assistant',
      text: `Posez une question sur ${context.name}. Je peux resumer la fiche, expliquer l'usage, aider sur les specifications ou preparer une demande de devis.`,
    },
  ]);
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const askQuestion = async (value: string) => {
    const trimmedQuestion = value.trim();
    if (!trimmedQuestion || isThinking) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedQuestion },
    ]);
    setQuestion('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/product-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmedQuestion,
          product: {
            name: context.name,
            sku: context.sku,
            brand: context.brand,
            category: context.category,
            packageSize: context.packageSize,
            shortDescription: context.shortDescription,
            description: context.description,
            specs: context.specFields
              .map((field) => ({
                label: field.field_label,
                value: getDisplayValue(context.data, field.field_key),
              }))
              .filter((spec) => spec.value),
          },
        }),
      });

      if (!response.ok) throw new Error('AI provider unavailable');

      const json = await response.json();
      const answer = typeof json.answer === 'string' ? json.answer : answerProductQuestion(trimmedQuestion, context);
      setIsUsingFallback(false);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: answer },
      ]);
    } catch {
      setIsUsingFallback(true);
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: answerProductQuestion(trimmedQuestion, context) },
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
            {isUsingFallback ? 'Mode fiche locale' : 'IA connectee si configuree'}
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
                    {message.text}
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
                  Analyse de la fiche produit...
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
            Pour les prix, stocks et validations critiques, l'assistant oriente vers une confirmation EsiLab.
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
