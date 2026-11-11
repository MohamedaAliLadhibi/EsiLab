export type Solution = {
  slug: string;
  name: string;
  accent: string;
  border: string;
  text: string;
  summary: string;
};

export type Product = {
  slug: string;
  brand: string;
  name: string;
  category: string;
  image: string;
  excerpt: string;
  description: string;
  audience: string;
  leadTime: string;
  support: string;
  highlights: string[];
  applications: string[];
  deliverables: string[];
  specs: Array<[string, string]>;
};

const placeholderProductImage = '/product-hero-cryoscope.svg';

export const solutions: Solution[] = [
  {
    slug: 'equipements-laboratoires',
    name: 'Équipements de laboratoire',
    accent: 'bg-orange',
    border: 'border-orange/30',
    text: 'text-orange',
    summary:
      'Instrumentation, centrifugation, hottes, microbiologie et solutions complètes pour les laboratoires scientifiques.',
  },
  {
    slug: 'metrologie-dimensionnelle',
    name: 'Métrologie dimensionnelle',
    accent: 'bg-cyan',
    border: 'border-cyan/30',
    text: 'text-cyan',
    summary:
      'Mesure, contrôle dimensionnel et vérification de précision pour les environnements exigeants.',
  },
  {
    slug: 'inspection-emballage',
    name: 'Inspection & Emballage',
    accent: 'bg-lime',
    border: 'border-lime/30',
    text: 'text-lime',
    summary:
      'Contrôle qualité, inspection visuelle et solutions industrielles de conditionnement et traçabilité.',
  },
  {
    slug: 'produits-chimiques-reactifs',
    name: 'Produits chimiques & réactifs',
    accent: 'bg-navy',
    border: 'border-navy/30',
    text: 'text-navy',
    summary:
      'Réactifs, consommables et produits de laboratoire adaptés aux usages de routine et de recherche.',
  },
];

export const brands = partnerBrands;

export const values = [
  {
    title: 'Assistance & accompagnement',
    text: "Du conseil avant achat jusqu'à la mise en service, nous accompagnons vos équipes avec une approche terrain.",
  },
  {
    title: 'Service après-vente',
    text: 'Nos ingénieurs et techniciens assurent installation, maintenance, formation et suivi durable.',
  },
  {
    title: 'Précision & fiabilité',
    text: 'Chaque gamme est sélectionnée pour sa performance, sa traçabilité et sa régularité en environnement professionnel.',
  },
];

export const productCategories = [
  {
    name: 'Analytique & Mesure',
    count: '14+ familles',
    summary: 'Mesure, caractérisation et contrôle qualité pour les workflows critiques.',
  },
  {
    name: 'Préparation & échantillons',
    count: '20+ families',
    summary: 'Centrifugation, agitation, temperature et manipulations fluides au quotidien.',
  },
  {
    name: 'Bioproduction & Microbiologie',
    count: '08+ familles',
    summary: 'Solutions robustes pour la culture, les environnements contrôlés et la stérilité.',
  },
];

export const featuredProducts: Product[] = [
  {
    slug: 'advanced-4250-cryoscope',
    brand: 'Advanced Instruments',
    name: 'Advanced 4250 Single-Sample Cryoscope',
    category: 'Analytique & Mesure',
    image: placeholderProductImage,
    excerpt:
      "Cryoscope à échantillon unique pour le contrôle précis de l'osmolalité, avec ergonomie de laboratoire et impression intégrée.",
    description:
      "Une solution pour les laboratoires qui souhaitent standardiser le contrôle de l'osmolalité. Le système combine rapidité, lisibilité des mesures et intégration fluide aux routines qualité.",
    audience: 'Laiteries, biopharma, laboratoires qualité et R&D',
    leadTime: 'Installation planifiable sous 2 à 4 semaines',
    support: 'Qualification, mise en route et formation des opérateurs',
    highlights: [
      'Mesure fiable de l’osmolalité',
      'Format compact pour paillasse',
      'Interface claire et maintenance simplifiée',
    ],
    applications: ['Contrôle qualité laitier', 'Biopharma', 'Vérification de conformité'],
    deliverables: ['Installation sur site', 'Formation de l’équipe', 'Support SAV'],
    specs: [
      ['Volume d’échantillon', '2,0 ou 2,5 mL'],
      ['Résolution', '1 m°C ou mOsm/kg'],
      ['Alimentation', '100 à 240 V CA'],
      ['Utilisation', 'Contrôle qualité, agroalimentaire, biopharma'],
    ],
  },
  {
    slug: 'brookfield-dvplus-viscometer',
    brand: 'Brookfield Ametek',
    name: 'DVPlus Viscometer',
    category: 'Analytique & Mesure',
    image: placeholderProductImage,
    excerpt:
      'Viscosimètre moderne pour des mesures reproductibles, avec interface tactile et exploitation fluide des données.',
    description:
      "Conçu pour les laboratoires qui souhaitent une lecture rapide, une meilleure répétabilité et une expérience opérateur moderne. Le DVPlus accélère les contrôles de routine tout en préservant la finesse d'analyse.",
    audience: 'Cosmétique, peinture, agroalimentaire et formulation',
    leadTime: 'Démonstration et configuration selon la viscosité cible',
    support: 'Aide au choix des mobiles, protocole de mesure et qualification',
    highlights: [
      'Haute précision de mesure',
      'Interface tactile intuitive',
      'Convient au contrôle de routine et à la R&D',
    ],
    applications: ['Formulation', 'Contrôle de processus', 'Comparaison de lots'],
    deliverables: ['Conseil applicatif', 'Mise en service', 'Appui méthodologique'],
    specs: [
      ['Affichage', 'Écran tactile couleur 5 pouces'],
      ['Plage de vitesse', 'Jusqu’à 740 incréments'],
      ['Usages', 'Viscosité, rhéologie, texture'],
      ['Atout', 'Connexion et lecture rapide des données'],
    ],
  },
  {
    slug: 'eppendorf-5430',
    brand: 'Eppendorf',
    name: 'Microcentrifugeuse 5430 / 5430 R',
    category: 'Préparation & échantillons',
    image: placeholderProductImage,
    excerpt:
      'Microcentrifugeuse compacte et polyvalente pour biologie, recherche et analyses de routine.',
    description:
      "Une plateforme appréciée par les équipes qui recherchent un équilibre entre compacité, performance et simplicité d'utilisation. Elle s'intègre bien aux laboratoires en flux continu.",
    audience: 'Biologie moléculaire, contrôle de routine, laboratoires académiques',
    leadTime: 'Disponibilité selon le rotor et la version réfrigérée',
    support: 'Formation des opérateurs, maintenance et suivi préventif',
    highlights: ['Format compact', 'Large choix de rotors', 'Usage silencieux et fiable'],
    applications: ['Préparation ADN/ARN', 'Centrifugation rapide', 'Flux de travail en laboratoire'],
    deliverables: ['Installation', 'Qualification de base', 'SAV local'],
    specs: [
      ['Vitesse maximale', 'Jusqu’à 30 130 × g'],
      ['Capacités', 'Tubes coniques et plaques MTP'],
      ['Interface', 'Menu multilingue rétroéclairé'],
      ['Usage', 'Cellules, échantillons, biologie'],
    ],
  },
  {
    slug: 'esco-airstream-class-ii',
    brand: 'Esco Scientific',
    name: 'Airstream Class II Biosafety Cabinet',
    category: 'Bioproduction & Microbiologie',
    image: placeholderProductImage,
    excerpt:
      'Poste de sécurité microbiologique conçu pour protéger l’opérateur, le produit et l’environnement lors des manipulations sensibles.',
    description:
      "Pensé pour les laboratoires qui ont besoin d'une protection fiable, d'une circulation d'air maîtrisée et d'une intégration adaptée aux espaces contrôlés. Ce poste de sécurité allie protection et confort d'utilisation.",
    audience: 'Microbiologie, pharma, contrôle stérile et laboratoires hospitaliers',
    leadTime: 'Configuration selon largeur et classe de filtration',
    support: 'Validation, installation et maintenance préventive',
    highlights: [
      'Protection tripartite opérateur-produit-environnement',
      'Faible niveau sonore',
      'Conception adaptée aux salles contrôlées',
    ],
    applications: ['Manipulations stériles', 'Culture cellulaire', 'Préparation d’échantillons critiques'],
    deliverables: ['Mise en place', 'Vérification du fonctionnement', 'Programme de maintenance'],
    specs: [
      ['Classe', 'Class II Type A2'],
      ['Flux', 'Flux d’air contrôlé avec filtration HEPA'],
      ['Usage', 'Travaux microbiologiques et stériles'],
      ['Options', 'UV, support, configuration sur mesure'],
    ],
  },
  {
    slug: 'memmert-universal-oven',
    brand: 'Memmert',
    name: 'Universal Oven UN Series',
    category: 'Préparation & échantillons',
    image: placeholderProductImage,
    excerpt:
      'Étuve universelle de laboratoire pour le séchage, le chauffage et la stabilité thermique dans les applications exigeantes.',
    description:
      'Une solution reconnue pour sa stabilité thermique, son interface lisible et sa qualité de fabrication. Elle convient aux procédures répétables.',
    audience: 'Contrôle qualité, matériaux, pharma et recherche',
    leadTime: 'Dimensionnement selon volume et plage thermique',
    support: 'Aide au choix, mise en service et entretien',
    highlights: [
      'Homogénéité thermique',
      'Construction durable',
      'Interface lisible et pilotage intuitif',
    ],
    applications: ['Séchage', 'Conditionnement thermique', 'Essais de stabilité'],
    deliverables: ['Sélection de gamme', 'Installation', 'Support technique'],
    specs: [
      ['Volumes', '32 à 749 litres'],
      ['Plage', 'De la température ambiante à 300 °C'],
      ['Pilotage', 'Contrôleur numérique intuitif'],
      ['Atout', 'Reproductibilité des conditions'],
    ],
  },
  {
    slug: 'nova-dairy-analyzer',
    brand: 'Nova Dairy',
    name: 'Nova Dairy Analyzer',
    category: 'Analytique & Mesure',
    image: placeholderProductImage,
    excerpt:
      'Analyseur laitier pour établir rapidement les indicateurs de composition et renforcer la cadence du laboratoire.',
    description:
      'Conçu pour les acteurs de la filière laitière qui ont besoin de décisions rapides, d’une interface exploitable par les techniciens et d’un bon compromis entre cadence et confiance métrologique.',
    audience: 'Laiteries, collecte, contrôle à la réception et qualité',
    leadTime: 'Paramétrage selon la méthode et les flux analytiques',
    support: 'Configuration, vérification et accompagnement terrain',
    highlights: ['Cadence adaptée aux flux qualité', 'Lecture claire', 'Support applicatif local'],
    applications: ['Réception des matières', 'Suivi de production', 'Contrôle de conformité'],
    deliverables: ['Conseil process', 'Installation', 'Assistance exploitation'],
    specs: [
      ['Analyses', 'Composition laitière selon la configuration'],
      ['Usage', 'Contrôle à la réception et suivi de production'],
      ['Interface', 'Lecture numérique simple'],
      ['Services', 'Accompagnement mise en route'],
    ],
  },
];

export const clientReferences = ['Delice', 'Azur', 'Unimed', 'Saiph', 'Coficab', 'Adwya', 'Inrap', 'Sonobra'];

export const company = {
  phone: '(+216) 70 036 096 / (+216) 31 586 072',
  email: 'contact.esilab@esilab.tn',
  address: '4 Boulevard de la Qualité de la Vie, Ariana 2058, Tunisie',
};

export function getProduct(slug: string) {
  return featuredProducts.find((product) => product.slug === slug);
}

export const savContact = {
  name: 'Achraf Kouki',
  role: 'Responsable SAV',
  email: 'achraf.kouki@esilab.tn',
  phone: '50783775',
  phoneDisplay: '+216 50 783 775',
  whatsapp: '21650783775',
};
import { partnerBrands } from './brands';
