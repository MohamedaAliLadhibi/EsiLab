require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../src/db/knex');

const CONCURRENCY = Number(process.env.IMAGE_CHECK_CONCURRENCY || 32);
const TIMEOUT_MS = Number(process.env.IMAGE_CHECK_TIMEOUT_MS || 12000);

function withTimeout(promise, ms) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    run: promise(controller.signal).finally(() => clearTimeout(timeout)),
  };
}

async function checkUrl(url) {
  const request = async (signal, method) => fetch(url, { method, redirect: 'follow', signal });

  try {
    let wrapped = withTimeout((signal) => request(signal, 'HEAD'), TIMEOUT_MS);
    let response = await wrapped.run;

    if ([401, 403, 405].includes(response.status)) {
      wrapped = withTimeout((signal) => request(signal, 'GET'), TIMEOUT_MS);
      response = await wrapped.run;
    }

    return {
      url,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      error: error.name === 'AbortError' ? 'timeout' : error.message,
    };
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await mapper(items[index], index);
      if ((index + 1) % 250 === 0) {
        console.log(`checked ${index + 1}/${items.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const rows = await db('products').select('id', 'slug', 'data');
  const byUrl = new Map();

  for (const row of rows) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const imageUrl = data && data.image_url;
    if (!imageUrl) continue;

    if (!byUrl.has(imageUrl)) byUrl.set(imageUrl, []);
    byUrl.get(imageUrl).push({
      id: row.id,
      slug: row.slug,
      sku: data.sku || null,
      name: data.name || null,
      brand: data.brand || null,
      category: data.category || null,
    });
  }

  const urls = Array.from(byUrl.keys());
  console.log(`unique_urls ${urls.length}`);

  const checks = await mapLimit(urls, CONCURRENCY, checkUrl);
  const broken = checks
    .filter((result) => !result.ok)
    .map((result) => ({ ...result, products: byUrl.get(result.url) }));

  const report = {
    checkedAt: new Date().toISOString(),
    uniqueUrlCount: urls.length,
    brokenUrlCount: broken.length,
    brokenProductCount: broken.reduce((sum, item) => sum + item.products.length, 0),
    broken,
  };

  const outDir = path.resolve(__dirname, '..', '..', 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'broken-product-images.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`broken_urls ${report.brokenUrlCount}`);
  console.log(`broken_products ${report.brokenProductCount}`);
  console.log(`report ${outPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
