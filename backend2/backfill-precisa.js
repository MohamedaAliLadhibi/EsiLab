// backfill-precisa.js — apply Precisa images by series prefix
const db = require('./src/db/knex');
const fs = require('fs');

const images = JSON.parse(fs.readFileSync('precisa-images.json', 'utf8'));

function findImage(sku) {
  if (!sku) return null;
  // Precisa SKUs: "165-9327-050", "330-9243B-001" — first 3 chars are the series
  const match = String(sku).match(/^(\d{3})/);
  return match ? (images[match[1]] || null) : null;
}

(async () => {
  // Match "Precisa " with or without trailing space, case-insensitive
  const supplier = await db('suppliers')
    .whereRaw("LOWER(TRIM(name)) = 'precisa'")
    .first();

  if (!supplier) {
    console.error('❌ No supplier named "Precisa" found (checked with case + whitespace trim).');
    process.exit(1);
  }

  console.log(`Using supplier_id=${supplier.id} (name="${supplier.name}")`);

  const products = await db('products').where({ supplier_id: supplier.id }).select('id', 'data');
  console.log(`Processing ${products.length} Precisa products...`);

  let updated = 0, already = 0;
  const unmatched = [];

  for (const p of products) {
    if (p.data?.image_url) { already++; continue; }

    const img = findImage(p.data?.sku);
    if (img) {
      await db('products').where({ id: p.id }).update({
        data: { ...p.data, image_url: img },
        updated_at: db.fn.now(),
      });
      updated++;
    } else {
      unmatched.push(p.data?.sku);
    }
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️  Already had image: ${already}`);
  console.log(`❌ Unmatched: ${unmatched.length}`);
  if (unmatched.length) {
    console.log('\nFirst 30 unmatched SKUs:');
    unmatched.slice(0, 30).forEach((s) => console.log(`  ${s}`));
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });