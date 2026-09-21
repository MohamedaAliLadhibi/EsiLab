const pages = [
  'https://www.novabiomedical.com/dairy-testing/cryoscope/',
  'https://www.novabiomedical.com/dairy-testing/cryoline-supplies/',
  'https://www.novabiomedical.com/dairy-testing/fluorophos/',
  'https://www.novabiomedical.com/anaerobic-jar-systems/advanced-anoxomat-iii/',
  'https://www.novabiomedical.com/anaerobic-jar-systems/palladox-and-accessories/',
];

async function status(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return response.status;
  } catch (error) {
    return error.message;
  }
}

async function main() {
  for (const page of pages) {
    const html = await fetch(page).then((response) => response.text());
    const candidates = new Set();
    const pattern = /(?:src|data-src|srcset)=["']([^"']+)/g;
    let match;

    while ((match = pattern.exec(html))) {
      const values = match[1].split(',').map((item) => item.trim().split(/\s+/)[0]);
      for (const value of values) {
        if (value.includes('/inc/uploads/') || value.includes('/up/assets/')) {
          candidates.add(new URL(value, page).href);
        }
      }
    }

    console.log(`\nPAGE ${page}`);
    for (const url of candidates) {
      console.log(`${await status(url)} ${url}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
