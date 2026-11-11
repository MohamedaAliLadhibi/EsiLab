import { FlaskConical, Microscope, Ruler, Scale, ScanSearch } from 'lucide-react';
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
    name: 'Équipements de laboratoire',
    summary:
      'Instrumentation, centrifugation, hottes, microbiologie et solutions complètes pour les laboratoires scientifiques.',
    icon: Microscope,
    accent: 'from-blue to-cyan',
    chip: 'border-blue/25 bg-blue/5 text-blue',
    surface: 'border-blue/20 bg-blue/5',
  },
  {
    slug: 'metrologie-dimensionnelle',
    name: 'Métrologie dimensionnelle',
    summary:
      'Mesure, contrôle dimensionnel et vérification de précision pour les environnements exigeants.',
    icon: Ruler,
    accent: 'from-cyan to-lime',
    chip: 'border-cyan/25 bg-cyan/5 text-cyan',
    surface: 'border-cyan/20 bg-cyan/5',
  },
  {
    slug: 'metrologie-masses-pesage',
    name: 'Métrologie des masses & pesage',
    summary: 'Balances, masses étalons et équipements de pesage pour le contrôle métrologique.',
    icon: Scale,
    accent: 'from-blue to-cyan',
    chip: 'border-blue/25 bg-blue/5 text-blue',
    surface: 'border-blue/20 bg-blue/5',
  },
  {
    slug: 'inspection-emballage',
    name: 'Inspection & emballage',
    summary:
      'Contrôle qualité, inspection visuelle et solutions industrielles de conditionnement et traçabilité.',
    icon: ScanSearch,
    accent: 'from-lime to-orange',
    chip: 'border-lime/30 bg-lime/10 text-lime',
    surface: 'border-lime/25 bg-lime/10',
  },
  {
    slug: 'produits-chimiques-reactifs',
    name: 'Produits chimiques & réactifs',
    summary:
      'Réactifs, consommables et produits de laboratoire adaptés aux usages de routine et de recherche.',
    icon: FlaskConical,
    accent: 'from-orange to-scarlet',
    chip: 'border-orange/25 bg-orange/5 text-orange',
    surface: 'border-orange/20 bg-orange/5',
  },
];
