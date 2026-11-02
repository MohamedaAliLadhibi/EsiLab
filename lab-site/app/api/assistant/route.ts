import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/catalogue';
import { company, savContact } from '@/lib/site-data';

export const runtime = 'nodejs';

type Message = { role: 'user' | 'assistant'; content: string };
type Product = {
  slug: string;
  data?: Record<string, unknown>;
  assigned_category?: string;
  category_slug?: string;
  _fieldMeta?: Record<string, { field_label?: string }>;
};
type ProductCard = { slug: string; name: string; sku: string; brand: string; category: string };
type AssistantLink = { label: string; href: string };

const stopWords = new Set(
  'a an and are as at au aux avec besoin bon bonne ce cette cherche chercher comment dans de des du en est for help il je la le les leur moi mon ne notre of on ou pour propose quelle quel que qui recherche rechercher suis sur the this un une want what with'.split(' '),
);

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getSearchTerms(question: string, previousQuestion = '') {
  const text = normalize(`${question} ${question.trim().length < 28 ? previousQuestion : ''}`);
  if (/\b(balance|balances|analytique|analytical|weighing)\b/.test(text)) {
    return ['balance', 'analytical balance', 'analytique', 'weighing'];
  }
  if (/\b(ph|p\s*h|acidimetre|acidimeter|potentiometrique|potentiometric)\b/.test(text)) {
    return ['pH meter', 'pH', 'acidimeter', 'electrode'];
  }
  const words = text.match(/[a-z0-9][a-z0-9.+/-]{1,}/g) || [];
  return Array.from(new Set(words.filter((word) => word.length > 2 && !stopWords.has(word)))).slice(0, 5);
}

async function findProducts(terms: string[]) {
  if (!terms.length) return [] as Product[];
  const results = await Promise.all(terms.map(async (term) => {
    const params = new URLSearchParams({ page: '1', limit: '8', search: term });
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error('catalogue_unavailable');
    return (await response.json()) as { data?: Product[] };
  }));

  const scoreBySlug = new Map<string, { product: Product; score: number }>();
  results.forEach((result, index) => {
    for (const product of result.data || []) {
      if (!product.slug) continue;
      const current = scoreBySlug.get(product.slug) || { product, score: 0 };
      current.score += 1 + (index === 0 ? 2 : 0);
      scoreBySlug.set(product.slug, current);
    }
  });

  return Array.from(scoreBySlug.values()).sort((a, b) => b.score - a.score).slice(0, 6).map(({ product }) => product);
}

async function findProductBySlug(slug: string) {
  if (!/^[a-z0-9-]{1,255}$/i.test(slug)) return null;
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(9000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('product_unavailable');
  const result = await response.json() as { data?: Product };
  return result.data || null;
}

function productName(product: Product) {
  const data = product.data || {};
  return String(data.name || data.product_name || data.title || data.sku || product.slug);
}

function toProductCard(product: Product): ProductCard {
  const data = product.data || {};
  return {
    slug: product.slug,
    name: productName(product),
    sku: String(data.sku || data.reference || ''),
    brand: String(data.brand || data.supplier || data.manufacturer || ''),
    category: String(product.assigned_category || data.category || product.category_slug || ''),
  };
}

function productSpecs(product: Product) {
  const data = product.data || {};
  const hidden = new Set([
    'name', 'product_name', 'title', 'sku', 'reference', 'ref', 'code', 'brand', 'supplier', 'manufacturer',
    'category', 'category_name', 'description', 'details', 'short_description', 'summary', 'excerpt',
    'image', 'image_url', 'photo', 'picture', 'technical_specs', 'information_sources', 'manufacturer_url',
    'datasheet_url', 'enrichment_status', 'product_family_key', 'product_family_name', 'variant_attributes',
  ]);
  const formatLabel = (key: string) => product._fieldMeta?.[key]?.field_label || key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const values: Array<[string, string]> = [];
  const addValue = (key: string, value: unknown, label = formatLabel(key)) => {
    if (typeof value === 'string' && value.trim()) values.push([label, value.trim()]);
    else if (typeof value === 'number' || typeof value === 'boolean') values.push([label, String(value)]);
  };

  for (const [key, value] of Object.entries(data)) {
    if (hidden.has(key.toLowerCase())) continue;
    addValue(key, value);
  }
  if (data.technical_specs && typeof data.technical_specs === 'object' && !Array.isArray(data.technical_specs)) {
    for (const [key, value] of Object.entries(data.technical_specs as Record<string, unknown>)) addValue(key, value);
  }
  return values.slice(0, 8);
}

const contactLinks: AssistantLink[] = [
  { label: 'Contacter EsiLab', href: '/contact' },
  { label: 'Appeler (+216) 70 036 096', href: 'tel:+21670036096' },
  { label: 'Appeler (+216) 31 586 072', href: 'tel:+21631586072' },
  { label: 'Envoyer un email', href: `mailto:${company.email}` },
];

function answerFor(question: string, product: Product | null, products: Product[], searchQuery: string) {
  const q = normalize(question);
  const trimmedQuestion = q.trim();
  const isGreeting = /^(bonjour|bonsoir|salut|hello|hi|hey)\b/.test(trimmedQuestion);
  if (isGreeting) {
    return {
      answer: /^(salut|hey|hi)\b/.test(trimmedQuestion)
        ? 'Salut ! Ravi de vous aider 😊 Vous cherchez un équipement, une marque ou une information technique ?'
        : 'Bonjour ! Ravi de vous aider. Vous cherchez un équipement, une marque ou une information technique ?',
      products: [],
    };
  }

  if (/^(merci|merci beaucoup|thanks|thank you|c est gentil|super merci|parfait merci)\b/.test(trimmedQuestion)) {
    return {
      answer: 'Avec plaisir 😊 Si vous avez une autre question ou besoin d’aide pour choisir un équipement, je suis là !',
      products: [],
    };
  }

  if (/\b(devis|prix|quotation|quote)\b/.test(q)) {
    return {
      answer: `Pour demander un devis, contactez-nous via la page Contact, par téléphone au ${company.phone}, ou par email à ${company.email}. Indiquez la référence du produit et votre besoin pour faciliter le traitement de votre demande.`,
      products: [],
      links: contactLinks,
    };
  }

  if (/\b(utiliser|utilisation|mode d emploi|mode operatoire|how to use)\b/.test(q)) {
    return {
      answer: `Pour les instructions d’utilisation et les précautions adaptées à ce produit, contactez notre équipe SAV. Nous sommes disponibles pour vous accompagner. SAV : +216 ${savContact.phoneDisplay} · ${savContact.email}.`,
      products: product ? [toProductCard(product)] : [],
      links: [
        { label: 'Contacter le SAV', href: '/sav' },
        { label: 'Appeler le SAV', href: `tel:+216${savContact.phone}` },
        { label: 'Écrire au SAV', href: `mailto:${savContact.email}` },
      ],
    };
  }

  if (/\b(specification|specifications|caracteristique|caracteristiques|details techniques|technical specs)\b/.test(q)) {
    if (!product) return { answer: 'Ouvrez la fiche du produit concerné pour consulter ses caractéristiques techniques.', products: [] as ProductCard[] };
    const specs = productSpecs(product);
    const answer = specs.length
      ? `Voici les informations techniques enregistrées dans le catalogue pour ${productName(product)} :\n${specs.map(([label, value]) => `• ${label} : ${value}`).join('\n')}`
      : `La fiche de ${productName(product)} ne contient pas encore de caractéristiques détaillées. Notre équipe peut vous renseigner. Référence : ${String(product.data?.sku || 'voir la fiche produit')}.`;
    return { answer, products: [toProductCard(product)], ...(specs.length ? {} : { links: contactLinks }) };
  }

  if (/\b(compatible|compatibilite|compatibilites|mon besoin|mon application|my application)\b/.test(q)) {
    return {
      answer: 'La compatibilité dépend de votre application et des caractéristiques requises. Donnez-nous votre usage, les échantillons concernés et les critères importants ; notre équipe pourra confirmer le bon choix.',
      products: product ? [toProductCard(product)] : [],
      links: contactLinks,
    };
  }

  if (/\b(incubateur|incubators?|incubation)\b/.test(q)) {
    return {
      answer: `Pour choisir un incubateur adapté, notre équipe peut vous conseiller selon le volume, la plage de température, l’application et votre budget. Contactez-nous pour une recommandation précise : ${company.phone} · ${company.email}.`,
      products: [],
      links: contactLinks,
    };
  }

  if (products.length) {
    const searchName = /\b(ph|p\s*h|acidimetre|acidimeter)\b/.test(q)
      ? 'pH'
      : /\b(balance|balances|analytique|analytical|weighing)\b/.test(q)
        ? 'balance analytique'
        : searchQuery;
    return {
      answer: `Voici les produits du catalogue correspondant à « ${searchName} ». Sélectionnez une fiche pour voir ses détails, sa référence et ses caractéristiques.`,
      products: products.map(toProductCard),
      links: [{ label: 'Voir les résultats dans le catalogue', href: `/products?search=${encodeURIComponent(searchName)}` }],
    };
  }

  const searchName = /\b(ph|p\s*h|acidimetre|acidimeter)\b/.test(q)
    ? 'pH'
    : /\b(balance|balances|analytique|analytical|weighing)\b/.test(q)
      ? 'balance analytique'
      : searchQuery;
  return {
    answer: `Je n’ai pas trouvé de correspondance exacte dans le catalogue pour « ${searchName} ». Essayez un nom de produit, une marque ou une référence, ou contactez notre équipe pour être guidé.`,
    products: [],
    links: [
      { label: 'Rechercher dans le catalogue', href: `/products?search=${encodeURIComponent(searchName)}` },
      ...contactLinks,
    ],
  };
}

export async function POST(request: Request) {
  let body: { messages?: Message[]; productSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Message invalide.' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter((message): message is Message =>
      (message?.role === 'user' || message?.role === 'assistant') && typeof message.content === 'string',
    ).slice(-8).map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1200) }))
    : [];
  const latestQuestion = [...messages].reverse().find((message) => message.role === 'user')?.content;
  if (!latestQuestion) return NextResponse.json({ error: 'Écrivez une question pour commencer.' }, { status: 400 });

  const previousQuestion = messages.slice(0, -1).reverse().find((message) => message.role === 'user')?.content || '';
  const normalizedQuestion = normalize(latestQuestion);
  const isPreparedAnswer = /^(bonjour|bonsoir|salut|hello|hi|hey|merci|thanks|thank you|c est gentil|super merci|parfait merci)\b/.test(normalizedQuestion.trim())
    || /\b(devis|prix|quotation|quote|utiliser|utilisation|mode d emploi|mode operatoire|how to use|compatible|compatibilite|compatibilites|mon besoin|mon application|my application|incubateur|incubators?|incubation|specification|specifications|caracteristique|caracteristiques|details techniques|technical specs)\b/.test(normalizedQuestion);
  const shouldSearchCatalogue = !body.productSlug && !isPreparedAnswer;
  const terms = shouldSearchCatalogue ? getSearchTerms(latestQuestion, previousQuestion) : [];
  const searchQuery = /\b(ph|p\s*h|acidimetre|acidimeter)\b/i.test(normalize(latestQuestion))
    ? 'pH'
    : /\b(balance|balances|analytique|analytical|weighing)\b/i.test(normalize(latestQuestion))
      ? 'balance analytique'
      : latestQuestion.trim();

  let products: Product[];
  let currentProduct: Product | null;
  try {
    [products, currentProduct] = await Promise.all([
      shouldSearchCatalogue ? findProducts(terms) : Promise.resolve([] as Product[]),
      typeof body.productSlug === 'string' ? findProductBySlug(body.productSlug) : Promise.resolve(null),
    ]);
  } catch {
    return NextResponse.json({ error: 'Le catalogue est momentanément indisponible. Réessayez dans un instant.' }, { status: 503 });
  }

  if (currentProduct) products = [currentProduct, ...products.filter((item) => item.slug !== currentProduct?.slug)].slice(0, 6);
  const result = answerFor(latestQuestion, currentProduct, products, searchQuery);
  return NextResponse.json(result);
}
