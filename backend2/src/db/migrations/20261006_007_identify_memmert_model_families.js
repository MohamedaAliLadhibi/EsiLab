const PRODUCT_SHEETS_URL = 'https://www.memmert.com/en/downloads/downloads/product-data-sheets';
const MODEL_PATTERN = /^(UN|UF|IF|IN|ICO|IPP|ICP|ICH|HCP|HPP|SF|SN|VO|WTB)[- ]?(\d+)(mplus|ecoplus|plus|pa|m|eco|med|L|TS)?/i;

function familyLabel(code) {
  const model = code.toUpperCase();
  const suffix = model.replace(/^(UN|UF|IF|IN|ICO|IPP|ICP|ICH|HCP|HPP|SF|SN|VO|WTB)\d+/, '');
  if (/^UN|^UF/.test(model)) {
    if (suffix === 'PA') return 'Étuve à paraffine';
    if (suffix.includes('TS')) return 'Étuve traversante';
    if (suffix.startsWith('M')) return 'Étuve universelle médicale';
    return 'Étuve universelle';
  }
  if (model.startsWith('ICO')) return 'Incubateur CO₂';
  if (model.startsWith('IPP')) return 'Incubateur réfrigéré Peltier';
  if (model.startsWith('ICP')) return 'Incubateur réfrigéré à compresseur';
  if (model.startsWith('IF') || model.startsWith('IN')) return 'Incubateur';
  if (model.startsWith('ICH')) return 'Enceinte climatique';
  if (model.startsWith('HCP')) return 'Enceinte à humidité contrôlée';
  if (model.startsWith('HPP')) return 'Enceinte climatique constante';
  if (model.startsWith('SF') || model.startsWith('SN')) return 'Stérilisateur à air chaud';
  if (model.startsWith('VO')) return 'Étuve sous vide';
  if (model.startsWith('WTB')) return 'Bain-marie';
  return 'Équipement Memmert';
}

function getModelCode(sku) {
  const match = String(sku || '').match(MODEL_PATTERN);
  return match ? `${match[1]}${match[2]}${match[3] || ''}` : null;
}

exports.up = async function (knex) {
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'MERMMET'")
    .select('p.id', 'p.data');
  const now = new Date().toISOString();

  for (const row of rows) {
    const data = { ...row.data };
    const modelCode = getModelCode(data.sku);
    if (!modelCode) continue;

    const family = familyLabel(modelCode);
    const familyKey = `memmert-${modelCode.toLowerCase()}`;
    if (!data.name) {
      data.name = `${family} Memmert ${modelCode}`;
      data.enrichment_generated_name = true;
    }
    if (!data.short_description) {
      data.short_description = `Référence ${data.sku} du modèle ${modelCode}. Les caractéristiques détaillées dépendent de la configuration et sont à vérifier dans la documentation fabricant.`;
      data.enrichment_generated_short_description = true;
    }
    data.product_family_key = familyKey;
    data.product_family_name = `${family} ${modelCode}`;
    data.model_code = modelCode;
    data.manufacturer_url = PRODUCT_SHEETS_URL;
    data.enrichment_status = 'family_identified';
    data.information_sources = [{
      publisher: 'Memmert',
      title: 'Model family identified from manufacturer reference and product image',
      url: data.image_url || PRODUCT_SHEETS_URL,
      documentation_url: PRODUCT_SHEETS_URL,
      verified_at: now,
    }];

    await knex('products').where({ id: row.id }).update({
      data: JSON.stringify(data),
      updated_at: knex.fn.now(),
    });
  }
};

exports.down = async function (knex) {
  const rows = await knex('products as p')
    .join('suppliers as s', 's.id', 'p.supplier_id')
    .whereRaw("upper(s.name) = 'MERMMET'")
    .select('p.id', 'p.data');
  for (const row of rows) {
    const data = { ...row.data };
    if (!String(data.product_family_key || '').startsWith('memmert-')) continue;
    delete data.product_family_key;
    delete data.product_family_name;
    delete data.model_code;
    delete data.manufacturer_url;
    delete data.enrichment_status;
    delete data.information_sources;
    if (data.enrichment_generated_name) delete data.name;
    if (data.enrichment_generated_short_description) delete data.short_description;
    delete data.enrichment_generated_name;
    delete data.enrichment_generated_short_description;
    await knex('products').where({ id: row.id }).update({ data: JSON.stringify(data) });
  }
};

exports.familyLabel = familyLabel;
exports.getModelCode = getModelCode;
