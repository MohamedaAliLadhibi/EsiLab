const BACKUP_TABLE = 'catalogue_cleanup_backup_20261109';
const HIDDEN_OPTION_SKUS = new Set(['350-8694', '350-8695']);
const EMPTY_AUDITED_SKU = '490-9608-002';

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

exports.up = async function (knex) {
  await knex.schema.createTable(BACKUP_TABLE, (table) => {
    table.bigInteger('product_id').primary();
    table.boolean('is_active').notNullable();
    table.jsonb('data').notNullable();
  });

  const products = await knex('products').select('id', 'is_active', 'data');
  const changes = [];
  for (const row of products) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : { ...row.data };
    const sku = text(data.sku).toUpperCase();
    const name = text(data.name || data.product_name || data.title);
    const rowHeading = sku === 'ITEM-NO' || name.toUpperCase() === 'OPTIONS & ACCESSORIES';
    const standaloneOption = HIDDEN_OPTION_SKUS.has(sku);
    const auditedEmptyFiche = sku === EMPTY_AUDITED_SKU && ![
      data.description, data.short_description, data.brand, data.supplier,
      data.manufacturer, data.specifications, data.technical_specs,
    ].some((value) => typeof value === 'string' ? value.trim() : value && typeof value === 'object' && Object.keys(value).length > 0);
    const correctedData = JSON.parse(JSON.stringify(data).replace(/Humidty Trap/g, 'Humidity Trap'));
    if (/^Calibration weight with certificate,\s*500\s*g,\s*F1,\s*accuracy\s*2\.5\s*mg$/i.test(text(correctedData.name))) {
      correctedData.name = 'Masse étalon 500 g, classe F1, avec certificat (EMT 2,5 mg)';
    }
    if (/\b(calibration weight|test weight|weight set|masse etalon|poids de calibration)\b/i.test(text(correctedData.name))
      && /Precisa_Balances|Precisa-321-(?:LS|LX)-Range/i.test(text(correctedData.image_url))) {
      delete correctedData.image_url;
    }
    const shouldHide = rowHeading || standaloneOption || auditedEmptyFiche;
    const shouldCorrect = JSON.stringify(correctedData) !== JSON.stringify(data);

    if (!shouldHide && !shouldCorrect) continue;
    changes.push({ id: row.id, is_active: row.is_active, data: JSON.parse(JSON.stringify(data)) });
    await knex('products').where({ id: row.id }).update({
      ...(shouldHide ? { is_active: false } : {}),
      data: JSON.stringify(correctedData),
      updated_at: knex.fn.now(),
    });
  }

  if (changes.length) {
    await knex(BACKUP_TABLE).insert(changes.map(({ id, is_active, data }) => ({
      product_id: id,
      is_active,
      data: JSON.stringify(data),
    })));
  }
};

exports.down = async function (knex) {
  const backups = await knex(BACKUP_TABLE).select('product_id', 'is_active', 'data');
  for (const backup of backups) {
    await knex('products').where({ id: backup.product_id }).update({
      is_active: backup.is_active,
      data: backup.data,
    });
  }
  await knex.schema.dropTableIfExists(BACKUP_TABLE);
};
