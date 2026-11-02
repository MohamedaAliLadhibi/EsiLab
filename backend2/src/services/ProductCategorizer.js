const CATEGORIES = [
  { slug: 'equipements-laboratoires', name: 'Equipements Laboratoires' },
  { slug: 'metrologie-dimensionnelle', name: 'Metrologie Dimensionnelle' },
  { slug: 'inspection-emballage', name: 'Inspection & Emballage' },
  { slug: 'produits-chimiques-reactifs', name: 'Produits Chimiques & Reactifs' },
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
  if (knownCategory) return knownCategory;

  const identity = normalize([
    data.name, data.product_name, data.title, data.sku, data.category,
  ].filter(Boolean).join(' '));
  const text = normalize([
    identity, data.short_description, data.description, data.specifications,
    data.brand, data.manufacturer,
  ].filter(Boolean).join(' '));

  if (data.cas_number || /\b(reactif|reagent|chemical|chimique|solvent|solvant|buffer solution|buffer reagent|ph buffer|tampon de calibration|culture medium|culture media)\b/.test(text) ||
    /\b(combitips?|eptips|ep\.t\.i\.p\.s|safe-lock|tubes?|reaction vessels?|cryovials?|vials?|microplates?|pcr plates?|twin\.tec|plate sealing|sealing mats?|pipette tips?|tips? for pipettes|reservoirs?)\b/.test(identity)) {
    return CATEGORIES[3];
  }
  if (/\b(visual inspection system|inspection system|inspection camera|machine vision|quality inspection system|packaging machine|packaging line|industrial packaging|industrial filling|traceability system|system traceability|tracabilite industrielle|labeler|etiqueteuse)\b/.test(text)) {
    return CATEGORIES[2];
  }
  if (/\b(caliper|pied a coulisse|micrometer|micrometre|micrometer|gauge block|jauge|dimensional|dimensionnel|metrology|metrologie|calibration weight|test weight|weight set|masse etalon|poids de calibration)\b/.test(text)) {
    return CATEGORIES[1];
  }
  if (/\b(equipment|equipement|instrumentation|laboratory|laboratoires?|centrifuge|viscometer|viscosimeter|viscosimetre|microscope|incubator|incubateur|oven|etuve|hood|hotte|analyzer|analyseur|balance|pipette|research plus|multipette|xplorer|reference|epmotion|easypet|spectrophotometer|spectrophotometre|cryoscope|autoclave|stirrer|agitateur|bath|bain thermostat|microbiology|microbiologie|charger|carousel|holder|accessories|accessory|rotor|adapter|power supply|spare parts?|printer|stand|rack|buffer|freezer|cryocube|thermomixer|mastercycler|cycler|shaker|cellxpert|innova|door|lid|pcb|panel|cable|control|housing|motor|switch|spring|cover|assembly|compressor|fan|thermoblock|platform|handle|pump|valve|fuse|sensor|display|board|tool)\b/.test(text)) {
    return CATEGORIES[0];
  }

  const supplier = normalize(supplierName);
  if (/\b(memmert|mermmet|precisa|eppendorf)\b/.test(`${text} ${supplier}`)) return CATEGORIES[0];

  return null;
}

module.exports = { CATEGORIES, classifyProduct };
