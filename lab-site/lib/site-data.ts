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
    name: 'Equipements Laboratoires',
    accent: 'bg-orange',
    border: 'border-orange/30',
    text: 'text-orange',
    summary:
      'Instrumentation, centrifugation, hotte, microbiologie et solutions completes pour laboratoires scientifiques.',
  },
  {
    slug: 'metrologie-dimensionnelle',
    name: 'Metrologie Dimensionnelle',
    accent: 'bg-cyan',
    border: 'border-cyan/30',
    text: 'text-cyan',
    summary:
      'Mesure, controle dimensionnel et verification de precision pour les environnements exigeants.',
  },
  {
    slug: 'inspection-emballage',
    name: 'Inspection & Emballage',
    accent: 'bg-lime',
    border: 'border-lime/30',
    text: 'text-lime',
    summary:
      'Controle qualite, inspection visuelle et solutions industrielles de conditionnement et tracabilite.',
  },
  {
    slug: 'produits-chimiques-reactifs',
    name: 'Produits Chimiques & Reactifs',
    accent: 'bg-navy',
    border: 'border-navy/30',
    text: 'text-navy',
    summary:
      'Reactifs, consommables et produits de laboratoire adaptes aux usages de routine et de recherche.',
  },
];

export const brands = [
  'Advanced Instruments',
  'Brookfield Ametek',
  'Eppendorf',
  'Esco Scientific',
  'Osmotech',
  'Airstream',
];

export const values = [
  {
    title: 'Assistance & Accompagnement',
    text: 'Du conseil avant achat jusqu a la mise en service, nous accompagnons vos equipes avec une approche terrain.',
  },
  {
    title: 'Service Apres-Vente',
    text: 'Nos ingenieurs et techniciens assurent installation, maintenance, formation et suivi durable.',
  },
  {
    title: 'Precision & Fiabilite',
    text: 'Chaque gamme est selectionnee pour sa performance, sa tracabilite et sa regularite en environnement professionnel.',
  },
];

export const productCategories = [
  {
    name: 'Analytique & Mesure',
    count: '14+ familles',
    summary: 'Mesure, caracterisation et controle de qualite pour les workflows critiques.',
  },
  {
    name: 'Preparation & Echantillons',
    count: '20+ families',
    summary: 'Centrifugation, agitation, temperature et manipulations fluides au quotidien.',
  },
  {
    name: 'Bioproduction & Microbiologie',
    count: '08+ familles',
    summary: 'Solutions robustes pour culture, environnement controle et sterilite.',
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
      'Cryoscope a echantillon unique pour le controle precis de l osmolalite avec ergonomie laboratoire et impression integree.',
    description:
      'Une solution premium pour les laboratoires qui veulent standardiser le controle de l osmolalite sans alourdir les operations de paillasse. Le systeme combine vitesse, lisibilite des mesures et integration fluide dans les routines qualite.',
    audience: 'Laiteries, biopharma, laboratoires qualite et R&D',
    leadTime: 'Installation planifiable sous 2 a 4 semaines',
    support: 'Qualification, mise en route et formation operateur',
    highlights: [
      'Mesure fiable de l osmolalite',
      'Format compact pour paillasse',
      'Interface claire et maintenance simplifiee',
    ],
    applications: ['Controle qualite laitier', 'Biopharma', 'Verification de conformite'],
    deliverables: ['Installation sur site', 'Formation equipe', 'Support SAV'],
    specs: [
      ['Volume echantillon', '2.0 ou 2.5 mL'],
      ['Resolution', '1 mC ou mOsm/kg'],
      ['Alimentation', '100 a 240V AC'],
      ['Utilisation', 'Controle qualite, agroalimentaire, biopharma'],
    ],
  },
  {
    slug: 'brookfield-dvplus-viscometer',
    brand: 'Brookfield Ametek',
    name: 'DVPlus Viscometer',
    category: 'Analytique & Mesure',
    image: placeholderProductImage,
    excerpt:
      'Viscosimetre moderne pour mesures reproductibles avec interface tactile et exploitation fluide des donnees.',
    description:
      'Concu pour les laboratoires qui veulent une lecture rapide, une meilleure repetabilite et une experience operateur plus moderne. Le DVPlus aide a accelerer les controles de routine tout en gardant une vraie finesse d analyse.',
    audience: 'Cosmetique, peinture, agroalimentaire et formulation',
    leadTime: 'Demonstration et configuration selon votre viscosite cible',
    support: 'Aide au choix des spindle, protocole de mesure et qualification',
    highlights: [
      'Haute precision de mesure',
      'Interface tactile intuitive',
      'Convient au controle routine et R&D',
    ],
    applications: ['Formulation', 'Controle process', 'Comparaison de lots'],
    deliverables: ['Conseil applicatif', 'Mise en service', 'Appui methodologique'],
    specs: [
      ['Affichage', 'Ecran tactile couleur 5 pouces'],
      ['Plage vitesse', 'Jusqu a 740 increments'],
      ['Usages', 'Viscosite, rheologie, texture'],
      ['Atout', 'Connexion et lecture rapide des donnees'],
    ],
  },
  {
    slug: 'eppendorf-5430',
    brand: 'Eppendorf',
    name: 'Microcentrifugeuse 5430 / 5430 R',
    category: 'Preparation & Echantillons',
    image: placeholderProductImage,
    excerpt:
      'Microcentrifugeuse compacte et polyvalente pour biologie, recherche et analyses de routine.',
    description:
      'Une plateforme tres appreciee pour les equipes qui cherchent un compromis solide entre compacite, performance et simplicite d usage. Elle s integre bien dans les laboratoires qui tournent en flux continu.',
    audience: 'Biologie moleculaire, controle routine, laboratoires academiques',
    leadTime: 'Disponibilite selon rotor et version refrigeration',
    support: 'Formation operateur, maintenance et suivi preventif',
    highlights: ['Format compact', 'Large choix de rotors', 'Usage silencieux et fiable'],
    applications: ['Preparation ADN/ARN', 'Spin down rapide', 'Workflow de laboratoire'],
    deliverables: ['Installation', 'Qualification de base', 'SAV local'],
    specs: [
      ['Vitesse max', 'Jusqu a 30 130 x g'],
      ['Capacites', 'Tubes coniques et MTP'],
      ['Interface', 'Menu multilingue retroeclaire'],
      ['Usage', 'Cellules, echantillons, biologie'],
    ],
  },
  {
    slug: 'esco-airstream-class-ii',
    brand: 'Esco Scientific',
    name: 'Airstream Class II Biosafety Cabinet',
    category: 'Bioproduction & Microbiologie',
    image: placeholderProductImage,
    excerpt:
      'Poste de securite microbiologique pour proteger operateur, produit et environnement dans les manipulations sensibles.',
    description:
      'Pensé pour les laboratoires qui ont besoin d une protection fiable, d une circulation d air maitrisee et d une integration propre dans les espaces controlés. Le cabinet valorise autant la securite que le confort quotidien.',
    audience: 'Microbiologie, pharma, controle sterile et laboratoires hospitaliers',
    leadTime: 'Configuration selon largeur et classe de filtration',
    support: 'Validation, installation et maintenance preventive',
    highlights: [
      'Protection tripartite operateur-produit-environnement',
      'Faible niveau sonore',
      'Design propre pour salle controlee',
    ],
    applications: ['Manipulations steriles', 'Culture cellulaire', 'Preparation echantillons critiques'],
    deliverables: ['Mise en place', 'Verification fonctionnement', 'Programme maintenance'],
    specs: [
      ['Classe', 'Class II Type A2'],
      ['Flux', 'Airflow controle avec filtration HEPA'],
      ['Usage', 'Travaux microbiologiques et steriles'],
      ['Options', 'UV, support, configuration sur mesure'],
    ],
  },
  {
    slug: 'memmert-universal-oven',
    brand: 'Memmert',
    name: 'Universal Oven UN Series',
    category: 'Preparation & Echantillons',
    image: placeholderProductImage,
    excerpt:
      'Etuve universelle de laboratoire pour sechage, chauffage et stabilite thermique dans les workflows exigeants.',
    description:
      'Une solution reconnue pour les laboratoires qui veulent une temperature stable, une interface lisible et une qualite de fabrication rassurante. Parfaite pour structurer des procedures repetables.',
    audience: 'Controle qualite, materiaux, pharma et recherche',
    leadTime: 'Dimensionnement selon volume et plage thermique',
    support: 'Aide au choix, mise en service et entretien',
    highlights: [
      'Homogeneite thermique',
      'Construction durable',
      'Interface lisible et pilotage intuitif',
    ],
    applications: ['Sechage', 'Conditionnement thermique', 'Essais stabilite'],
    deliverables: ['Selection de gamme', 'Installation', 'Support technique'],
    specs: [
      ['Volumes', '32 a 749 litres'],
      ['Plage', 'Au-dessus de l ambiant a 300 C'],
      ['Pilotage', 'Controleur numerique intuitif'],
      ['Atout', 'Reproductibilite des conditions'],
    ],
  },
  {
    slug: 'nova-dairy-analyzer',
    brand: 'Nova Dairy',
    name: 'Nova Dairy Analyzer',
    category: 'Analytique & Mesure',
    image: placeholderProductImage,
    excerpt:
      'Analyseur laitier pour etablir rapidement les indicateurs de composition et renforcer la cadence du laboratoire.',
    description:
      'Concu pour les acteurs de la filiere laitiere qui ont besoin de decisions rapides, d une interface exploitable par les techniciens et d un bon compromis entre cadence et confiance metrologique.',
    audience: 'Laiteries, collecte, controle reception et qualite',
    leadTime: 'Parametrage selon methode et flux analytiques',
    support: 'Configuration, verification et accompagnement terrain',
    highlights: ['Cadence adaptee aux flux qualite', 'Lecture claire', 'Support applicatif local'],
    applications: ['Reception matiere', 'Suivi production', 'Controle de conformite'],
    deliverables: ['Conseil process', 'Installation', 'Assistance exploitation'],
    specs: [
      ['Analyses', 'Composition laitiere selon configuration'],
      ['Usage', 'Controle reception et suivi production'],
      ['Interface', 'Lecture numerique simple'],
      ['Services', 'Accompagnement mise en route'],
    ],
  },
];

export const clientReferences = ['Delice', 'Azur', 'Unimed', 'Saiph', 'Coficab', 'Adwya', 'Inrap', 'Sonobra'];

export const company = {
  phone: '(+216) 70 036 096 / (+216) 31 586 072',
  email: 'contact@esilab.tn',
  address: 'Bloc C, 4 Boulevard de la qualite de la vie, Ariana 2058.',
};

export function getProduct(slug: string) {
  return featuredProducts.find((product) => product.slug === slug);
}
