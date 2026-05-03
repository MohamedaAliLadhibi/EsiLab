// tests/ImportService.test.js
const XLSX = require('xlsx');
const { parseExcelBuffer, colLetterToIndex } = require('../src/services/ImportService');

// ── Helpers ───────────────────────────────────────────────────────────────

function makeExcelBuffer(rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

// ── colLetterToIndex ──────────────────────────────────────────────────────

describe('colLetterToIndex', () => {
  test('A → 0', () => expect(colLetterToIndex('A')).toBe(0));
  test('B → 1', () => expect(colLetterToIndex('B')).toBe(1));
  test('Z → 25', () => expect(colLetterToIndex('Z')).toBe(25));
  test('AA → 26', () => expect(colLetterToIndex('AA')).toBe(26));
  test('lowercase a → 0', () => expect(colLetterToIndex('a')).toBe(0));
});

// ── parseExcelBuffer ──────────────────────────────────────────────────────

const supplierNova = { name: 'Nova', header_row_number: 1 };

const novaMappingMap = {
  sku:      { source_column: 'A', field_type: 'text',  field_label: 'SKU' },
  name:     { source_column: 'B', field_type: 'text',  field_label: 'Product Name' },
  category: { source_column: 'C', field_type: 'text',  field_label: 'Category' },
};

describe('parseExcelBuffer — Nova supplier', () => {
  test('parses mapped fields and ignores unmapped columns', () => {
    const rows = [
      ['SKU', 'Product Name', 'Category', 'European Base Price'], // header row 1
      ['4250', 'Cryoscope 4250', 'Dairy', '1500'],
      ['5000', 'Centrifuge Pro', 'Instruments', '3200'],
    ];

    const buf = makeExcelBuffer(rows);
    const { products, rowErrors } = parseExcelBuffer(buf, supplierNova, novaMappingMap);

    expect(rowErrors).toHaveLength(0);
    expect(products).toHaveLength(2);

    expect(products[0]).toEqual({ sku: '4250', name: 'Cryoscope 4250', category: 'Dairy' });
    expect(products[0]).not.toHaveProperty('European Base Price');
    expect(products[1].sku).toBe('5000');
  });

  test('skips rows with empty SKU (section headers)', () => {
    const rows = [
      ['SKU', 'Name', 'Category'],
      ['Instruments', '', ''],           // section header row
      ['4250', 'Cryoscope 4250', 'Dairy'],
    ];

    const buf = makeExcelBuffer(rows);
    const { products, rowErrors } = parseExcelBuffer(buf, supplierNova, novaMappingMap);

    expect(products).toHaveLength(1);
    expect(products[0].sku).toBe('4250');
  });

  test('strips price-looking keys even if somehow injected', () => {
    const mappingWithPrice = {
      ...novaMappingMap,
      price: { source_column: 'D', field_type: 'text', field_label: 'Price' },
    };

    const rows = [
      ['SKU', 'Name', 'Category', 'Price'],
      ['4250', 'Cryoscope', 'Dairy', '999'],
    ];

    const buf = makeExcelBuffer(rows);
    const { products } = parseExcelBuffer(buf, supplierNova, mappingWithPrice);

    expect(products[0]).not.toHaveProperty('price');
  });

  test('throws when no SKU column is mapped', () => {
    const noSkuMapping = {
      name: { source_column: 'A', field_type: 'text', field_label: 'Name' },
    };

    const buf = makeExcelBuffer([['Name'], ['Test Product']]);
    expect(() => parseExcelBuffer(buf, supplierNova, noSkuMapping)).toThrow(/sku/i);
  });
});

describe('parseExcelBuffer — Eppendorf supplier (header on row 3)', () => {
  const supplierEpp = { name: 'Eppendorf', header_row_number: 3 };

  const eppMappingMap = {
    sku:               { source_column: 'A', field_type: 'text',      field_label: 'SKU' },
    name:              { source_column: 'B', field_type: 'text',      field_label: 'Short Title' },
    description:       { source_column: 'C', field_type: 'rich_text', field_label: 'Full Description' },
    image_url:         { source_column: 'D', field_type: 'image_url', field_label: 'Image URL' },
  };

  test('respects header_row_number and skips preamble rows', () => {
    const rows = [
      ['Eppendorf Product Export'],                          // row 1 — preamble
      ['Generated: 2024-01-01'],                            // row 2 — preamble
      ['Material', 'Short desc', 'Sales text', 'Picture link', 'Internal Price'], // row 3 — header
      ['EP-0030', 'Pipette 1mL', '<p>Full desc</p>', 'https://img.com/1.jpg', '45.00'],
    ];

    const buf = makeExcelBuffer(rows);
    const { products, rowErrors } = parseExcelBuffer(buf, supplierEpp, eppMappingMap);

    expect(rowErrors).toHaveLength(0);
    expect(products).toHaveLength(1);
    expect(products[0].sku).toBe('EP-0030');
    expect(products[0].image_url).toBe('https://img.com/1.jpg');
    expect(products[0]).not.toHaveProperty('Internal Price');
  });
});
