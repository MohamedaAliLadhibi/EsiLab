// scrape-precisa-products.js — scrape product pages to find the hero image
const https = require('https');
const fs = require('fs');

// One representative product per series
const productPages = {
  '165': 'https://www.precisa.com/product/bj-100m/',
  '321': 'https://www.precisa.com/product/lx-120a/',
  '330': 'https://www.precisa.com/product/xm-60-hr/',
  '340': 'https://www.precisa.com/product/prepash-229/',
  '360': 'https://www.precisa.com/product/ep-125sm/',
  '365': 'https://www.precisa.com/product/em-120-hr/',
  '390': 'https://www.precisa.com/product/hf-125sm/',
  '490': 'https://www.precisa.com/product/i-12000d/',
  '520': 'https://www.precisa.com/product/pb-120a/',
};

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  },
};

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, options, (res) => {
      const status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : 'https://www.precisa.com' + res.headers.location;
        res.destroy();
        return resolve(fetch(loc));
      }
      if (status !== 200) { res.destroy(); return resolve({ status, data: '' }); }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: 200, data }));
    });
    req.on('error', () => resolve({ status: -1, data: '' }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ status: -2, data: '' }); });
  });
}

(async () => {
  const images = {};

  for (const [series, url] of Object.entries(productPages)) {
    console.log(`\n=== Series ${series} (${url})`);
    const { status, data } = await fetch(url);

    if (status !== 200) { console.log(`  [${status}] failed`); continue; }

    // Find WordPress product images — they typically use /wp-content/uploads/ and are the "main" hero
    const imgs = [...data.matchAll(/["'](https?:\/\/www\.precisa\.com\/wp-content\/uploads\/[^"']+\.(?:png|jpg|jpeg|webp))["']/gi)]
      .map((m) => m[1])
      .filter((u) => !/(logo|icon|favicon|flag|placeholder|ISO_9001|certification|small|_page)/i.test(u));

    const uniq = [...new Set(imgs)];
    console.log(`  Found ${uniq.length} image URLs`);
    uniq.slice(0, 3).forEach((u) => console.log(`    ${u}`));

    if (uniq.length > 0) {
      images[series] = uniq[0];
    }
  }

  fs.writeFileSync('precisa-images.json', JSON.stringify(images, null, 2));
  console.log(`\n\n=== SAVED precisa-images.json (${Object.keys(images).length} series) ===`);
  Object.entries(images).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
})();