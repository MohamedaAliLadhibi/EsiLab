// src/services/ImportService.js
const XLSX = require('xlsx');
const db = require('../db/knex');
const SupplierFieldMapping = require('../models/SupplierFieldMapping');
const Product = require('../models/Product');
const logger = require('../utils/logger');

function colLetterToIndex(letter) {
  let index = 0;
  for (const char of letter.toUpperCase()) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }
  return index - 1;
}

function isSkippableRow(rowValues, skuColumnIndex) {
  if (!rowValues || rowValues.length === 0) return true;
  const skuValue = rowValues[skuColumnIndex];
  if (skuValue === undefined || skuValue === null || String(skuValue).trim() === '') return true;
  if (rowValues.every((v) => v === undefined || v === null || String(v).trim() === '')) return true;
  const nonEmptyValues = rowValues.filter((v) => v !== undefined && v !== null && String(v).trim() !== '');
  if (nonEmptyValues.length === 1 && !/[0-9._/-]/.test(String(skuValue))) return true;
  return false;
}

function parseExcelBuffer(fileBuffer, supplier, mappingMap) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  // Merge ALL sheets — supports multi-sheet supplier files
  const allRows = [];
  const headerRowIndex = (supplier.header_row_number || 1) - 1;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const sheetRows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    // Skip header rows at the top of each sheet
    allRows.push(...sheetRows.slice(headerRowIndex + 1));
  }

  // Build column-index → field_key map
  const colIndexToFieldKey = {};
  let skuColumnIndex = -1;

  for (const [fieldKey, mapping] of Object.entries(mappingMap)) {
    const idx = colLetterToIndex(mapping.source_column);
    colIndexToFieldKey[idx] = fieldKey;
    if (fieldKey === 'sku') skuColumnIndex = idx;
  }

  if (skuColumnIndex === -1) {
    throw new Error(`Supplier "${supplier.name}" has no "sku" field mapped.`);
  }

  const products = [];
  const rowErrors = [];
  const PRICE_KEY_PATTERNS = /price|cost|tarif|prix|preis|rate|msrp|rrp/i;

  allRows.forEach((rowValues, i) => {
    if (isSkippableRow(rowValues, skuColumnIndex)) return;

    try {
      const productData = {};

      for (const [colIndexStr, fieldKey] of Object.entries(colIndexToFieldKey)) {
        let value = rowValues[parseInt(colIndexStr)];
        value = value === undefined || value === null ? '' : String(value).trim();
        if (value !== '') productData[fieldKey] = value;
      }

      // Belt-and-suspenders price strip
      for (const key of Object.keys(productData)) {
        if (PRICE_KEY_PATTERNS.test(key)) {
          logger.warn(`[ImportService] Stripped suspicious key "${key}" from row ${i + 2}`);
          delete productData[key];
        }
      }

      if (!productData.sku) {
        rowErrors.push({ row: i + 2, error: 'Empty SKU, row skipped.' });
        return;
      }

      products.push(productData);
    } catch (err) {
      rowErrors.push({ row: i + 2, error: err.message });
    }
  });

  return { products, rowErrors };
}

async function runImport(importLogId, supplierId, fileBuffer, originalFilename) {
  await db('import_logs').where({ id: importLogId }).update({ status: 'processing', started_at: db.fn.now() });

  try {
    const supplier = await db('suppliers').where({ id: supplierId }).first();
    if (!supplier) throw new Error(`Supplier ${supplierId} not found`);

    const mappingMap = await SupplierFieldMapping.getMappingMap(supplierId);
    if (Object.keys(mappingMap).length === 0) throw new Error(`Supplier "${supplier.name}" has no field mappings.`);

    logger.info(`[Import #${importLogId}] Parsing "${originalFilename}" for supplier "${supplier.name}"`);

    const { products, rowErrors } = parseExcelBuffer(fileBuffer, supplier, mappingMap);
    logger.info(`[Import #${importLogId}] Parsed ${products.length} rows, ${rowErrors.length} errors`);

    const results = await Product.upsertBySku(supplierId, products);
    const allErrors = [...rowErrors, ...results.errors];

    await db('import_logs').where({ id: importLogId }).update({
      status:         allErrors.length === products.length && products.length > 0 ? 'failed' : 'completed',
      rows_processed: products.length + rowErrors.length,
      rows_inserted:  results.inserted,
      rows_updated:   results.updated,
      rows_skipped:   results.skipped + rowErrors.length,
      errors:         JSON.stringify(allErrors),
      completed_at:   db.fn.now(),
      updated_at:     db.fn.now(),
    });

    logger.info(`[Import #${importLogId}] Done. Inserted: ${results.inserted}, Updated: ${results.updated}, Skipped: ${results.skipped}`);
    return { success: true, importLogId, ...results, rowErrors };
  } catch (err) {
    logger.error(`[Import #${importLogId}] Failed: ${err.message}`);
    await db('import_logs').where({ id: importLogId }).update({
      status: 'failed',
      errors: JSON.stringify([{ error: err.message }]),
      completed_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
    throw err;
  }
}

module.exports = { runImport, parseExcelBuffer, colLetterToIndex };
