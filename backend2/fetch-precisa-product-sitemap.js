// fetch-precisa-product-sitemap.js
const https = require('https');
const fs = require('fs');

const url = 'https://www.precisa.com/product-sitemap.xml';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  },
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    console.log(`Fetched ${data.length} bytes, status ${res.statusCode}`);
    fs.writeFileSync('precisa-product-sitemap.xml', data);

    // Extract all <loc>...</loc> entries
    const locs = [...data.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    console.log(`Total URLs: ${locs.length}\n`);

    // Print all of them
    locs.forEach((u) => console.log(u));

    // Save just the list for later
    fs.writeFileSync('precisa-product-urls.txt', locs.join('\n'));
    console.log('\nSaved to precisa-product-urls.txt');
  });
}).on('error', (e) => console.error('ERR:', e.message));
