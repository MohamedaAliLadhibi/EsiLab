export const partnerBrands = [
  'Advanced Instruments',
  'Airstream',
  'Asecos',
  'Brookfield',
  'Eppendorf',
  'Esco',
  'Labthink',
  'Michell Instruments',
  'Mitutoyo',
  'Nabertherm',
  'Novasina',
  'Osmotech',
  'Testo',
  'VWR',
  'WIKA',
  'Zwiebel',
];

export function brandSlug(brand: string) {
  return brand
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
