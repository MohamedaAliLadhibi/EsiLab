// scrape-all-memmert.js — fetch each family landing page, extract all product images
const https = require('https');
const fs = require('fs');

// Every family landing page URL from the sitemap
const familyPages = {
  'constant-climate':  'https://www.memmert.com/en/products/climate-chambers/constant-climate-chamber',
  'climate-chamber':   'https://www.memmert.com/en/products/climate-chambers/climate-chamber',
  'humidity-chamber':  'https://www.memmert.com/en/products/climate-chambers/humidity-chamber',
  'universal-oven':    'https://www.memmert.com/en/products/heating-drying-ovens/universal-oven',
  'pass-through-oven': 'https://www.memmert.com/en/products/heating-drying-ovens/pass-through-oven',
  'paraffin-oven':     'https://www.memmert.com/en/products/heating-drying-ovens/paraffin-oven',
  'vacuum-oven':       'https://www.memmert.com/en/products/heating-drying-ovens/vacuum-oven',
  'peltier-incubator': 'https://www.memmert.com/en/products/incubators/peltier-cooled-incubator',
  'compressor-incubator': 'https://www.memmert.com/en/products/incubators/compressor-cooled-incubator',
  'co2-incubator':     'https://www.memmert.com/en/products/incubators/co2-incubator',
  'incubator':         'https://www.memmert.com/en/products/incubators/incubator',
};

// Also try these guessed URLs for the missing families
const extraPages = {
  'steriliser':      'https://www.memmert.com/en/products/heating-drying-ovens/hot-air-steriliser',
  'steriliser-alt':  'https://www.memmert.com/en/products/heating-drying-ovens/steriliser',
  'waterbath':       'https://www.memmert.com/en/products/water-baths',
  'waterbath-2':     'https://www.memmert.com/en/products/water-baths/water-bath',
};

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
  },
};

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, options, (res) => {
      const status = res.statusCode;
      if (status >= 300 && status < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith('http')
          ? res.headers.location
          : 'https://www.memmert.com' + res.headers.location;
        res.destroy();
        return resolve(fetch(loc));
      }
      if (status !== 200) { res.destroy(); return resolve(null); }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
  });
}

(async () => {
  const skuToImage = {};

  for (const [family, url] of Object.entries({ ...familyPages, ...extraPages })) {
    console.log(`\n=== ${family}`);
    const html = await fetch(url);
    if (!html) { console.log(`  ❌ failed`); continue; }

    // Extract every csm_{SKU}-..._{hash}.png from the HTML.
    // Filenames follow the pattern: csm_{SKU}-{description}_{hash}.png
    const imgs = [...html.matchAll(/["']([^"']*\/fileadmin\/_processed_\/[a-z0-9]+\/[a-z0-9]+\/csm_([A-Za-z0-9]+(?:plus)?(?:med)?)-([^"'\/]+)_([a-f0-9]+)\.(?:png|jpg|jpeg|webp))["']/gi)];

    const found = {};
    for (const m of imgs) {
      const fullPath = m[1];
      const sku = m[2]; // e.g. UF30, UF30plus, HPP110eco
      // Skip family-level images that aren't actual products
      if (sku.length < 4 || /^(medical|memmert|certification|logo)/i.test(sku)) continue;
      if (!found[sku]) {
        found[sku] = 'https://www.memmert.com' + fullPath;
      }
    }

    const skus = Object.keys(found);
    console.log(`  ✅ Found ${skus.length} SKUs with images`);
    skus.slice(0, 10).forEach((sku) => console.log(`      ${sku} → ${found[sku]}`));

    Object.assign(skuToImage, found);
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n\n=== TOTAL: ${Object.keys(skuToImage).length} SKUs with images`);
  fs.writeFileSync('memmert-images.json', JSON.stringify(skuToImage, null, 2));
  console.log('Saved to memmert-images.json');
})();