const path = require('path');
const XLSX = require('xlsx');
const db = require('../src/db/knex');
const Supplier = require('../src/models/Supplier');
const Product = require('../src/models/Product');
const SupplierFieldMapping = require('../src/models/SupplierFieldMapping');

const PRICE_KEYS = /price|cost|tarif|prix|preis|rate|msrp|rrp/i;

const imports = [
  {
    supplierName: 'Memmert',
    file: 'C:/Users/Dell/Downloads/Price-list_Memmert_01-2026-de-en.xlsx',
    notes: 'Imported from Price-list_Memmert_01-2026-de-en.xlsx. Price columns are excluded.',
    headerRow: 1,
    mappings: { sku: 'A', name: 'B', description: 'B', brand: 'C' },
    extractRows: extractMemmert,
  },
  {
    supplierName: 'Anoxomat',
    file: 'C:/Users/Dell/Downloads/2025 Anoxomat pricelist.xlsx',
    notes: 'Imported from 2025 Anoxomat pricelist.xlsx. Price/list metadata is excluded.',
    headerRow: 5,
    mappings: { sku: 'A', name: 'B', description: 'B', brand: 'C', category: 'D' },
    extractRows: extractStandardPortfolio,
  },
  {
    supplierName: 'Nova Dairy',
    file: 'C:/Users/Dell/Downloads/2026 Nova Pricelist - Dairy (1).xlsx',
    notes: 'Imported from 2026 Nova Pricelist - Dairy (1).xlsx. Price/list metadata is excluded.',
    headerRow: 6,
    mappings: { sku: 'A', name: 'B', description: 'B', category: 'D' },
    extractRows: extractNovaDairy,
  },
];

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function nonEmptyCount(row) {
  return row.filter((v) => clean(v)).length;
}

function readRows(file) {
  const wb = XLSX.readFile(file, { cellDates: false });
  const rows = [];
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
    rows.push(...sheetRows);
  }
  return rows;
}

function extractPackageSize(text) {
  const match = clean(text).match(/\b(?:Pkg|Package|Quantity):?\s*([A-Za-z0-9 .,\-xX/]+)/i);
  return match ? match[0].replace(/,\s*$/, '') : '';
}

function shortName(description, sku) {
  const text = clean(description);
  if (!text) return clean(sku);
  const firstClause = text.split(/[.;]/)[0].trim();
  return firstClause.length > 180 ? `${firstClause.slice(0, 177)}...` : firstClause;
}

function stripPriceKeys(data) {
  for (const key of Object.keys(data)) {
    if (PRICE_KEYS.test(key)) delete data[key];
  }
  return data;
}

function extractMemmert(file) {
  return readRows(file)
    .slice(1)
    .map((row) => {
      const sku = clean(row[0]);
      const description = clean(row[1]);
      const brand = clean(row[2]) || 'Memmert';
      if (!sku) return null;

      return stripPriceKeys({
        sku,
        name: shortName(description, sku),
        short_description: description ? shortName(description, sku) : '',
        description,
        brand,
        category: 'Laboratory equipment',
        package_size: extractPackageSize(description),
      });
    })
    .filter(Boolean);
}

function extractStandardPortfolio(file, fallbackBrand) {
  return readRows(file)
    .map((row) => {
      const sku = clean(row[0]);
      const description = clean(row[1]);
      const brand = clean(row[2]) || fallbackBrand || '';
      const category = clean(row[3]);
      if (!sku || !description) return null;
      if (/^part number$/i.test(sku)) return null;
      if (nonEmptyCount(row) < 2) return null;

      return stripPriceKeys({
        sku,
        name: shortName(description, sku),
        short_description: description,
        description,
        brand,
        category,
        package_size: extractPackageSize(description),
      });
    })
    .filter(Boolean);
}

function extractNovaDairy(file) {
  return readRows(file)
    .map((row) => {
      const sku = clean(row[0]);
      const description = clean(row[1]);
      const portfolio = clean(row[2]);
      const category = clean(row[3]);
      if (!sku || !description) return null;
      if (/^part number$/i.test(sku)) return null;
      if (nonEmptyCount(row) < 2) return null;

      return stripPriceKeys({
        sku,
        name: shortName(description, sku),
        short_description: description,
        description,
        brand: 'Nova',
        category: [portfolio, category].filter(Boolean).join(' - '),
        package_size: extractPackageSize(description),
      });
    })
    .filter(Boolean);
}

async function ensureSupplier(config) {
  const slugBase = config.supplierName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let supplier = await Supplier.findBySlug(slugBase);
  if (!supplier) {
    supplier = await db('suppliers')
      .whereRaw('lower(name) = ?', [config.supplierName.toLowerCase()])
      .first();
  }
  if (supplier) {
    const [updated] = await db('suppliers')
      .where({ id: supplier.id })
      .update({
        notes: config.notes,
        header_row_number: config.headerRow,
        is_active: true,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updated;
  }
  return Supplier.create({
    name: config.supplierName,
    notes: config.notes,
    header_row_number: config.headerRow,
    is_active: true,
  });
}

async function ensureMappings(supplierId, mappingByFieldKey) {
  const fields = await db('product_fields').select('id', 'field_key');
  const fieldByKey = Object.fromEntries(fields.map((field) => [field.field_key, field]));
  const mappings = Object.entries(mappingByFieldKey)
    .filter(([fieldKey]) => fieldByKey[fieldKey])
    .map(([fieldKey, source_column]) => ({ field_id: fieldByKey[fieldKey].id, source_column }));
  await SupplierFieldMapping.replaceForSupplier(supplierId, mappings);
}

async function run() {
  const summary = [];

  for (const config of imports) {
    const supplier = await ensureSupplier(config);
    await ensureMappings(supplier.id, config.mappings);

    const products = config.extractRows(config.file, config.supplierName);
    const result = await Product.upsertBySku(supplier.id, products);

    await db('import_logs').insert({
      supplier_id: supplier.id,
      original_filename: path.basename(config.file),
      status: 'completed',
      rows_processed: products.length,
      rows_inserted: result.inserted,
      rows_updated: result.updated,
      rows_skipped: result.skipped,
      errors: JSON.stringify(result.errors || []),
      started_at: db.fn.now(),
      completed_at: db.fn.now(),
    });

    summary.push({
      supplier: supplier.name,
      supplierId: supplier.id,
      parsed: products.length,
      inserted: result.inserted,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.length,
    });
  }

  console.table(summary);
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
