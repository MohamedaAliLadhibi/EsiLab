// backfill-memmert.js — assign Memmert images to products missing them
const db = require('./src/db/knex');
const fs = require('fs');

const images = JSON.parse(fs.readFileSync('memmert-images.json', 'utf8'));

// Sort base SKUs by length descending so the longest prefix match wins.
const baseSkus = Object.keys(images).sort((a, b) => b.length - a.length);

function findImageUrl(sku) {
  if (!sku) return null;

  // 1. Exact match
  if (images[sku]) return images[sku];

  // 2. Longest-prefix match (case-insensitive)
  const upper = sku.toUpperCase();
  for (const base of baseSkus) {
    if (upper.startsWith(base.toUpperCase())) {
      return images[base];
    }
  }

  // 3. Try stripping the last few characters (variant suffixes like F1, D8, V5, etc.)
  //    e.g. "HPP110ecoF1" -> try "HPP110eco"
  for (let i = 1; i <= 5; i++) {
    const trimmed = sku.slice(0, -i);
    if (images[trimmed]) return images[trimmed];
    const trimmedUpper = trimmed.toUpperCase();
    for (const base of baseSkus) {
      if (trimmedUpper.startsWith(base.toUpperCase())) {
        return images[base];
      }
    }
  }

  return null;
}

(async () => {
  const supplierId = 3; // Memmert

  const products = await db('products')
    .where({ supplier_id: supplierId })
    .select('id', 'data');

  console.log(`Processing ${products.length} Memmert products...`);

  let updated = 0;
  let alreadyHad = 0;
  const unmatched = [];

  for (const p of products) {
    const sku = p.data?.sku || '';

    // Skip if already has image
    if (p.data?.image_url) {
      alreadyHad++;
      continue;
    }

    const imgUrl = findImageUrl(sku);

    if (imgUrl) {
      await db('products').where({ id: p.id }).update({
        data: { ...p.data, image_url: imgUrl },
        updated_at: db.fn.now(),
      });
      updated++;
    } else {
      unmatched.push(sku);
    }
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️  Already had image: ${alreadyHad}`);
  console.log(`❌ Unmatched: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log('\nFirst 30 unmatched SKUs:');
    unmatched.slice(0, 30).forEach((s) => console.log(`  ${s}`));
  }

  process.exit(0);
})().catch((err) => {
  console.error('ERR:', err);
  process.exit(1);
});
