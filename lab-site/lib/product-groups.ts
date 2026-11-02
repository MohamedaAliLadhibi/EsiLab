import { FlaskConical, Microscope, Ruler, ScanSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ProductGroup = {
  slug: string;
  name: string;
  summary: string;
  icon: LucideIcon;
  accent: string;
  chip: string;
  surface: string;
};

// Shared by the homepage and catalogue so every entry points to a real filter.
export const productGroups: ProductGroup[] = [
  {
    slug: 'equipements-laboratoires',
    name: 'Equipements Laboratoires',
    summary:
      'Instrumentation, centrifugation, hotte, microbiologie et solutions completes pour laboratoires scientifiques.',
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
    icon: FlaskConical,
    accent: 'from-orange to-scarlet',
    chip: 'border-orange/25 bg-orange/5 text-orange',
    surface: 'border-orange/20 bg-orange/5',
  },
];
