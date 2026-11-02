const OPTIONS_DOC = 'https://www.precisa.com/wp-content/uploads/2022/10/SINGLES_EN_GC-CONTENT_STG19.pdf';
const CATALOG_2021 = 'https://www.precisa.com/wp-content/uploads/2021/11/en_GENERAL_CATALOG_f2.pdf';
const BALANCE_CATALOG = 'https://www.precisa.com/wp-content/uploads/2025/09/EN_GC-CONTENT_STG31.pdf';
const LS_SERIES_URL = 'https://www.precisa.com/series/series-321-ls-balances/';

const IP65_PRODUCTS = {
  '350-8694': { compatibleSeries: '360 EP / 360 ES' },
  '350-8695': { compatibleSeries: '321 LT / 321 LX / 321 LS' },
};

const ANALYTICAL_BALANCES = {
  '321-9249-001': {
    model: 'LS 120A SCS', capacity: '120 g', repeatability: '0.1 mg', minimumWeight: '20.0 mg',
  },
  '321-9250-001': {
    model: 'LS 220A SCS', capacity: '220 g', repeatability: '0.1 mg', minimumWeight: '20.0 mg',
  },
};

function addSource(data, docs, now) {
  data.information_sources = docs.map(({ title, url }) => ({
    publisher: 'Precisa Gravimetrics', title, url, verified_at: now,
  }));
  data.enrichment_status = 'source_verified';
}

exports.up = async function (knex) {
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'PRECISA'")
    .select('p.id', 'p.data');
  const idsBySku = new Map(rows.map((row) => [String(row.data?.sku || '').trim(), row.id]));
  const now = new Date().toISOString();

  for (const row of rows) {
    const data = { ...row.data };
    const sku = String(data.sku || '').trim();
    if (IP65_PRODUCTS[sku]) {
      const option = IP65_PRODUCTS[sku];
      data.product_family_key = 'precisa-ip65-balance-option';
      data.product_family_name = 'Option de protection IP65 Precisa';
      data.variant_attributes = { séries_compatibles: option.compatibleSeries };
      data.technical_specs = {
        indice_de_protection: 'IP65',
        protection: 'Protection contre les poussières et les jets d’eau à faible pression',
        installation: 'Montage en usine',
        séries_compatibles: option.compatibleSeries,
        disponibilité: 'Non disponible sur toutes les configurations; confirmer la compatibilité avec le modèle de balance.',
      };
      if (!data.short_description) {
        data.short_description = `Option IP65 installée en usine pour certaines balances Precisa des séries ${option.compatibleSeries}. Ce code désigne une option de configuration, pas une balance autonome.`;
        data.enrichment_generated_short_description = true;
      }
      data.manufacturer_url = sku === '350-8695' ? LS_SERIES_URL : CATALOG_2021;
      data.datasheet_url = sku === '350-8695' ? OPTIONS_DOC : CATALOG_2021;
      const otherSku = sku === '350-8694' ? '350-8695' : '350-8694';
      if (idsBySku.has(otherSku)) {
        data.equivalent_sku = otherSku;
        data.equivalent_product_id = idsBySku.get(otherSku);
      }
      addSource(data, [
        { title: 'Series 321 options and accessories', url: OPTIONS_DOC },
        { title: 'Precisa General Catalogue – balance options', url: CATALOG_2021 },
      ], now);
    }

    const balance = ANALYTICAL_BALANCES[sku];
    if (balance) {
      data.product_family_key = 'precisa-321-ls-analytical-balance';
      data.product_family_name = 'Balance analytique Precisa série 321 LS';
      data.variant_attributes = { modèle: balance.model, capacité: balance.capacity };
      data.technical_specs = {
        modèle: balance.model,
        capacité_maximale: balance.capacity,
        lisibilité: '0.1 mg',
        répétabilité: balance.repeatability,
        poids_minimal_de_pesée: balance.minimumWeight,
        linéarité: '0.2 mg',
        diamètre_du_plateau: '90 mm',
        classe_de_pesage: 'I / 1 mg',
        temps_de_réponse: '2 s',
        système_de_calibration: 'SCS – système d’auto-calibration',
      };
      if (!data.short_description) {
        data.short_description = `Balance analytique Precisa LS ${balance.model.match(/\d+A/)?.[0] || ''}, avec système SCS. Capacité ${balance.capacity} et lisibilité 0.1 mg.`;
        data.enrichment_generated_short_description = true;
      }
      data.manufacturer_url = LS_SERIES_URL;
      data.datasheet_url = BALANCE_CATALOG;
      addSource(data, [
        { title: 'General Catalogue 2025 – Series 321 LS specifications', url: BALANCE_CATALOG },
        { title: 'Precisa Series 321 LS product range', url: LS_SERIES_URL },
      ], now);
    }

    if (!IP65_PRODUCTS[sku] && !balance) continue;
    await knex('products').where({ id: row.id }).update({
      data: JSON.stringify(data),
      updated_at: knex.fn.now(),
    });
  }
};

exports.down = async function (knex) {
  const enrichedSkus = [...Object.keys(IP65_PRODUCTS), ...Object.keys(ANALYTICAL_BALANCES)];
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'PRECISA'")
    .select('p.id', 'p.data');
  const addedKeys = [
    'product_family_key', 'product_family_name', 'variant_attributes', 'technical_specs',
    'manufacturer_url', 'datasheet_url', 'information_sources', 'enrichment_status',
    'equivalent_sku', 'equivalent_product_id',
  ];
  for (const row of rows) {
    const data = { ...row.data };
    if (!enrichedSkus.includes(String(data.sku || '').trim())) continue;
    for (const key of addedKeys) delete data[key];
    if (data.enrichment_generated_short_description) delete data.short_description;
    delete data.enrichment_generated_short_description;
    await knex('products').where({ id: row.id }).update({ data: JSON.stringify(data) });
  }
};
