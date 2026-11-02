const CATALOG_URL = 'https://www.precisa.com/wp-content/uploads/2021/11/en_GENERAL_CATALOG_f2.pdf';
const PRODUCT_URL = 'https://www.precisa.com/product/calibration-weights/';

const WEIGHTS = {
  '350-8200': { mass: '50 g', class: 'E2', tolerance: '0.15 mg', certifiedSku: '350-8260' },
  '350-8201': { mass: '100 g', class: 'E2', tolerance: '0.15 mg', certifiedSku: '350-8261' },
  '350-8202': { mass: '200 g', class: 'E2', tolerance: '0.3 mg', certifiedSku: '350-8262' },
  '350-8203': { mass: '500 g', class: 'E2', tolerance: '0.75 mg', certifiedSku: '350-8263' },
  '350-8243': { mass: '100 g', class: 'F1', tolerance: '0.5 mg', certifiedSku: '350-8264' },
  '350-8244': { mass: '200 g', class: 'F1', tolerance: '1.0 mg', certifiedSku: '350-8265' },
  '350-8245': { mass: '500 g', class: 'F1', tolerance: '2.5 mg', certifiedSku: '350-8266' },
  '350-8246': { mass: '1 000 g', class: 'F1', tolerance: '5.0 mg', certifiedSku: '350-8267' },
  '350-8247': { mass: '100 g', class: 'F2', tolerance: '1.5 mg', certifiedSku: '350-8268' },
  '350-8248': { mass: '200 g', class: 'F2', tolerance: '3 mg', certifiedSku: '350-8269' },
  '350-8249': { mass: '500 g', class: 'F2', tolerance: '7.5 mg', certifiedSku: '350-8270' },
  '350-8250': { mass: '1 000 g', class: 'F2', tolerance: '15 mg', certifiedSku: '350-8271' },
  '350-8251': { mass: '2 000 g', class: 'F2', tolerance: '30 mg', certifiedSku: '350-8272' },
  '350-8252': { mass: '5 000 g', class: 'F2', tolerance: '75 mg', certifiedSku: '350-8273' },
  '350-8253': { mass: '2 000 g', class: 'M1', tolerance: '0.1 g', certifiedSku: '350-8274' },
  '350-8254': { mass: '5 000 g', class: 'M1', tolerance: '0.25 g', certifiedSku: '350-8275' },
  '350-8255': { mass: '10 000 g', class: 'M1', tolerance: '0.5 g', certifiedSku: '350-8276' },
  '350-8260': { mass: '50 g', class: 'E2', tolerance: '0.15 mg', certifiedSku: '350-8260' },
  '350-8261': { mass: '100 g', class: 'E2', tolerance: '0.15 mg', certifiedSku: '350-8261' },
  '350-8262': { mass: '200 g', class: 'E2', tolerance: '0.3 mg', certifiedSku: '350-8262' },
  '350-8263': { mass: '500 g', class: 'E2', tolerance: '0.75 mg', certifiedSku: '350-8263' },
  '350-8264': { mass: '100 g', class: 'F1', tolerance: '0.5 mg', certifiedSku: '350-8264' },
  '350-8265': { mass: '200 g', class: 'F1', tolerance: '1.0 mg', certifiedSku: '350-8265' },
  '350-8266': { mass: '500 g', class: 'F1', tolerance: '2.5 mg', certifiedSku: '350-8266' },
  '350-8267': { mass: '1 000 g', class: 'F1', tolerance: '5.0 mg', certifiedSku: '350-8267' },
  '350-8268': { mass: '100 g', class: 'F2', tolerance: '1.5 mg', certifiedSku: '350-8268' },
  '350-8269': { mass: '200 g', class: 'F2', tolerance: '3 mg', certifiedSku: '350-8269' },
  '350-8270': { mass: '500 g', class: 'F2', tolerance: '7.5 mg', certifiedSku: '350-8270' },
  '350-8271': { mass: '1 000 g', class: 'F2', tolerance: '15 mg', certifiedSku: '350-8271' },
  '350-8272': { mass: '2 000 g', class: 'F2', tolerance: '30 mg', certifiedSku: '350-8272' },
  '350-8273': { mass: '5 000 g', class: 'F2', tolerance: '75 mg', certifiedSku: '350-8273' },
  '350-8274': { mass: '2 000 g', class: 'M1', tolerance: '0.1 g', certifiedSku: '350-8274' },
  '350-8275': { mass: '5 000 g', class: 'M1', tolerance: '0.25 g', certifiedSku: '350-8275' },
  '350-8276': { mass: '10 000 g', class: 'M1', tolerance: '0.5 g', certifiedSku: '350-8276' },
  '350-8256': { setRange: '1 mg–1 000 g', class: 'F1', certifiedSku: '350-8278' },
  '350-8257': { setRange: '1 mg–500 g', class: 'F1', certifiedSku: '350-8277' },
  '350-8258': { setRange: '1 mg–500 g', class: 'F2', certifiedSku: '350-8279' },
  '350-8259': { setRange: '1 mg–1 000 g', class: 'F2', certifiedSku: '350-8280' },
  '350-8277': { setRange: '1 mg–500 g', class: 'F1', certifiedSku: '350-8277' },
  '350-8278': { setRange: '1 mg–1 000 g', class: 'F1', certifiedSku: '350-8278' },
  '350-8279': { setRange: '1 mg–500 g', class: 'F2', certifiedSku: '350-8279' },
  '350-8280': { setRange: '1 mg–1 000 g', class: 'F2', certifiedSku: '350-8280' },
};
const UNCERTIFIED_BY_CERTIFIED = Object.fromEntries(
  Object.entries(WEIGHTS)
    .filter(([sku]) => /^350-82(?:0|4|5)/.test(sku))
    .map(([sku, details]) => [details.certifiedSku, sku]),
);

exports.up = async function (knex) {
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'PRECISA'")
    .select('p.id', 'p.data');

  const idsBySku = new Map(rows.map((row) => [String(row.data?.sku || '').trim(), row.id]));
  const now = new Date().toISOString();

  for (const row of rows) {
    const sku = String(row.data?.sku || '').trim();
    const weight = WEIGHTS[sku];
    if (!weight) continue;

    const data = { ...row.data };
    const certified = /^350-82(?:6|7|8)/.test(sku);
    const equivalentSku = certified ? UNCERTIFIED_BY_CERTIFIED[sku] : weight.certifiedSku;

    data.product_family_key = 'precisa-calibration-weight';
    data.product_family_name = 'Poids de calibration Precisa';
    data.variant_attributes = {
      ...(weight.mass ? { valeur_nominale: weight.mass } : {}),
      ...(weight.setRange ? { plage_du_jeu: weight.setRange } : {}),
      classe: weight.class,
      certificat: certified ? 'Avec certificat' : 'Sans certificat',
    };
    data.technical_specs = {
      ...(weight.mass ? { valeur_nominale: weight.mass } : {}),
      ...(weight.setRange ? { plage_du_jeu: weight.setRange } : {}),
      classe_de_poids: weight.class,
      ...(weight.tolerance ? { erreur_maximale_admise: weight.tolerance } : {}),
      certificat: certified ? 'Fourni avec certificat' : 'Fourni sans certificat',
    };
    data.manufacturer_url = PRODUCT_URL;
    data.datasheet_url = CATALOG_URL;
    data.enrichment_status = 'source_verified';
    data.information_sources = [{
      publisher: 'Precisa Gravimetrics',
      title: 'General Catalogue – Calibration Weights',
      url: CATALOG_URL,
      product_url: PRODUCT_URL,
      verified_at: now,
    }];
    if (equivalentSku && idsBySku.has(equivalentSku)) {
      data.equivalent_sku = equivalentSku;
      data.equivalent_product_id = idsBySku.get(equivalentSku);
    }

    await knex('products').where({ id: row.id }).update({
      data: JSON.stringify(data),
      updated_at: knex.fn.now(),
    });
  }
};

exports.down = async function (knex) {
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'PRECISA'")
    .select('p.id', 'p.data');
  const keys = [
    'product_family_key', 'product_family_name', 'variant_attributes', 'technical_specs',
    'manufacturer_url', 'datasheet_url', 'enrichment_status', 'information_sources',
    'equivalent_sku', 'equivalent_product_id',
  ];
  for (const row of rows) {
    if (!WEIGHTS[String(row.data?.sku || '').trim()]) continue;
    const data = { ...row.data };
    for (const key of keys) delete data[key];
    await knex('products').where({ id: row.id }).update({ data: JSON.stringify(data) });
  }
};
