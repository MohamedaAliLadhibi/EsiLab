const path = require('path');
const XLSX = require('xlsx');

const files = [
  'C:/Users/Dell/Downloads/Price-list_Memmert_01-2026-de-en.xlsx',
  'C:/Users/Dell/Downloads/2025 Anoxomat pricelist.xlsx',
  'C:/Users/Dell/Downloads/2026 Nova Pricelist - Dairy (1).xlsx',
];

function compact(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/\s+/g, ' ').trim();
}

function nonEmptyCount(row) {
  return row.filter((v) => compact(v)).length;
}

function scoreHeader(row) {
  const joined = row.map(compact).join(' ').toLowerCase();
  let score = nonEmptyCount(row);
  for (const token of [
    'article', 'item', 'part', 'ref', 'reference', 'code', 'catalog', 'cat.',
    'model', 'description', 'designation', 'name', 'product', 'type', 'unit',
    'price', 'eur', 'sku',
  ]) {
    if (joined.includes(token)) score += 5;
  }
  return score;
}

function findHeaderRow(rows) {
  let best = { index: 0, score: -1 };
  rows.slice(0, 80).forEach((row, index) => {
    const score = scoreHeader(row);
    if (score > best.score && nonEmptyCount(row) >= 2) best = { index, score };
  });
  return best.index;
}

for (const file of files) {
  const wb = XLSX.readFile(file, { cellDates: false });
  console.log(`\nFILE: ${path.basename(file)}`);
  console.log(`Sheets: ${wb.SheetNames.join(', ')}`);
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
    const usedRows = rows.filter((r) => nonEmptyCount(r) > 0);
    if (usedRows.length === 0) continue;
    const headerIndex = findHeaderRow(rows);
    console.log(`\n  Sheet: ${sheetName}`);
    console.log(`  Used rows: ${usedRows.length}; guessed header row: ${headerIndex + 1}`);
    console.log(`  Header: ${JSON.stringify((rows[headerIndex] || []).map(compact))}`);
    for (let i = headerIndex + 1; i < Math.min(rows.length, headerIndex + 7); i++) {
      const row = rows[i] || [];
      if (nonEmptyCount(row) > 0) console.log(`  Row ${i + 1}: ${JSON.stringify(row.map(compact))}`);
    }
  }
}
