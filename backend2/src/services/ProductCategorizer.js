const CATEGORIES = [
  { slug: 'equipements-laboratoires', name: 'Équipements de laboratoire' },
  { slug: 'metrologie-dimensionnelle', name: 'Métrologie dimensionnelle' },
  { slug: 'metrologie-masses-pesage', name: 'Métrologie des masses & pesage' },
  { slug: 'inspection-emballage', name: 'Inspection & Emballage' },
  { slug: 'produits-chimiques-reactifs', name: 'Produits chimiques & réactifs' },
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function classifyProduct(data = {}, supplierName = '') {
  const slugCategory = CATEGORIES.find((category) => category.slug === data.category_slug);
  if (slugCategory) return slugCategory;
  const sourceCategory = normalize(data.category || data.categorie || data.category_name);
  const knownCategory = CATEGORIES.find((category) => normalize(category.name) === sourceCategory);

  const identity = normalize([
    data.name, data.product_name, data.title, data.sku,
  ].filter(Boolean).join(' '));
  const text = normalize([
    identity, data.short_description, data.description, data.specifications,
    data.brand, data.manufacturer, data.product_family_key, data.product_family_name,
  ].filter(Boolean).join(' '));
  const isCalibrationWeight = data.product_family_key === 'precisa-calibration-weight'
    || /\b(calibration weights?|test weights?|check weights?|weight sets?|mass standards?|masse[s]? etalon[s]?|poids? de calibration|poids? etalon[s]?)\b/.test(identity);
  const isBalanceOrScale = /\b(analytical|precision|carat|stirrer|industrial) (balance|scale)s?\b/.test(identity)
    && !/\b(accessories|accessory|vessel|adapter|cover|night|draft shield|hook|cable|feature|option)\b/.test(identity);

  if (/\b(combitips?|eptips|ep\.t\.i\.p\.s|safe-lock|tubes?|glassware|reaction vessels?|cryovials?|vials?|microplates?|pcr plates?|twin\.tec|plate sealing|sealing mats?|pipette tips?|tips? for pipettes|reservoirs?)\b/.test(identity)) {
    return CATEGORIES[0];
  }
  if (isCalibrationWeight || isBalanceOrScale) {
    return CATEGORIES[2];
  }
  if (data.cas_number || /\b(reactif|reagent|chemical|chimique|solvent|solvant|buffer solution|buffer reagent|ph buffer|tampon de calibration|culture medium|culture media)\b/.test(text)) {
    return CATEGORIES[4];
  }
  const supplier = normalize(supplierName);
  if (/\b(labthink|visual inspection system|inspection system|inspection camera|machine vision|quality inspection system|packaging machine|packaging line|packaging test(?:ing)?|packaging material|oxygen transmission|water vapou?r transmission|permeation|gas permeability|heat seal|seal strength|seal integrity|film thickness|coefficient of friction|bursting strength|tensile testing|leak tester|leak detection|industrial packaging|industrial filling|traceability system|system traceability|tracabilite industrielle|labeler|etiqueteuse)\b/.test(`${text} ${supplier}`)) {
    return CATEGORIES[3];
  }
  if (/\b(caliper|pied a coulisse|micrometer|micrometre|gauge block|jauge|dimensional|dimensionnel|metrology|metrologie)\b/.test(text)) {
    return CATEGORIES[1];
  }
  if (/\b(equipment|equipement|instrumentation|laboratory|laboratoires?|centrifuge|viscometer|viscosimeter|viscosimetre|microscope|incubator|incubateur|oven|etuve|hood|hotte|analyzer|analyseur|pipette|research plus|multipette|xplorer|reference|epmotion|easypet|spectrophotometer|spectrophotometre|cryoscope|autoclave|stirrer|agitateur|bath|bain thermostat|microbiology|microbiologie|charger|carousel|holder|accessories|accessory|rotor|adapter|power supply|spare parts?|printer|stand|rack|buffer|freezer|cryocube|thermomixer|mastercycler|cycler|shaker|cellxpert|innova|door|lid|pcb|panel|cable|control|housing|motor|switch|spring|cover|assembly|compressor|fan|thermoblock|platform|handle|pump|valve|fuse|sensor|display|board|tool|glassware|tubes?|consumables?|combitips?|eptips|ep\.t\.i\.p\.s|safe-lock|reaction vessels?|cryovials?|vials?|microplates?|pcr plates?|twin\.tec|plate sealing|sealing mats?|pipette tips?|tips? for pipettes|reservoirs?)\b/.test(text)) {
    return CATEGORIES[0];
  }

  if (knownCategory) return knownCategory;

  if (/\b(memmert|mermmet|precisa|eppendorf)\b/.test(`${text} ${supplier}`)) return CATEGORIES[0];

  return null;
}

module.exports = { CATEGORIES, classifyProduct };
