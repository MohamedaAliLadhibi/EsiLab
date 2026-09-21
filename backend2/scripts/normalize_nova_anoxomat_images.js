require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../src/db/knex');

const IMAGES = {
  anoxomat: 'https://www.novabiomedical.com/inc/uploads/2019/12/Anoxomat_800x554_Isolated.png',
  standardJars: 'https://www.novabiomedical.com/inc/uploads/2019/12/Standard-Jars-400x220-2.png',
  palladox: 'https://www.novabiomedical.com/inc/uploads/2019/12/Palladox-Box-400x220-1.png',
  cryoline: 'https://www.novabiomedical.com/inc/uploads/2019/12/Cryoline_Isolated_800x554_New_Logo.png',
  cryoscope4250: 'https://www.novabiomedical.com/inc/uploads/2019/12/4250-Cryoscope_New_Logo_800x544_Isolated.png',
  fluorophos: 'https://www.novabiomedical.com/inc/uploads/2019/12/FLM3000_800x554_New_Logo.png',
};

function classify(data) {
  const sku = String(data.sku || '').trim().toUpperCase();
  const name = String(data.name || '').toLowerCase();
  const category = String(data.category || '').toLowerCase();
  const brand = String(data.brand || '').toLowerCase();

  if (brand === 'anoxomat') {
    if (sku.startsWith('ANX') || category === 'instruments' || name.includes('anoxomat iii')) {
      return { image: IMAGES.anoxomat, reason: 'Anoxomat instrument/system family' };
    }

    if (sku === 'AN3146' || name.includes('palladox') || name.includes('catalyst')) {
      return { image: IMAGES.palladox, reason: 'Palladox/catalyst product' };
    }

    if (
      sku.startsWith('AJ') ||
      sku.startsWith('PH') ||
      sku.startsWith('TH') ||
      name.includes('jar') ||
      name.includes('petridish') ||
      name.includes('micro-well') ||
      name.includes('tube kit')
    ) {
      return { image: IMAGES.standardJars, reason: 'Anoxomat jar or jar accessory' };
    }

    return { image: IMAGES.anoxomat, reason: 'Anoxomat instrument/system family' };
  }

  if (brand === 'nova') {
    if (
      sku === '4250' ||
      sku === 'SK-4250' ||
      sku === 'RS232-CABLE' ||
      sku.startsWith('3D') ||
      sku.startsWith('3C') ||
      sku.startsWith('3LH') ||
      sku.startsWith('4C') ||
      sku.startsWith('4D') ||
      sku.startsWith('4LH') ||
      sku === '325511R' ||
      sku === '330016' ||
      sku === '390444' ||
      sku === '425A00' ||
      name.includes('cryoscope') ||
      name.includes('probe') ||
      name.includes('stir') ||
      name.includes('freeze') ||
      name.includes('mandrel') ||
      name.includes('yoke') ||
      name.includes('alignment tool') ||
      name.includes('rack, tubes')
    ) {
      return { image: IMAGES.cryoscope4250, reason: '4250 Cryoscope/probe-stir accessory family' };
    }

    if (
      sku === 'FLM300' ||
      sku === 'SK-FLM300' ||
      sku.startsWith('FL') ||
      sku.startsWith('ACM') ||
      name.includes('fluorophos') ||
      name.includes('alp') ||
      name.includes('cuvette') ||
      name.includes('pipet') ||
      category.includes('test kits')
    ) {
      return { image: IMAGES.fluorophos, reason: 'FLM300/Fluorophos product family' };
    }

    if (
      sku.startsWith('3LA') ||
      name.includes('calibration standard') ||
      name.includes('reference solution') ||
      name.includes('lactrol') ||
      name.includes('sample tubes')
    ) {
      return { image: IMAGES.cryoline, reason: 'CryoLine standards and controls family' };
    }
  }

  return null;
}

async function main() {
  const rows = await db('products').select('id', 'slug', 'data');
  const changes = [];

  await db.transaction(async (trx) => {
    for (const row of rows) {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      const match = classify(data || {});
      if (!match || data.image_url === match.image) continue;

      await trx('products')
        .where({ id: row.id })
        .update({
          data: JSON.stringify({ ...data, image_url: match.image }),
          updated_at: trx.fn.now(),
        });

      changes.push({
        id: row.id,
        slug: row.slug,
        sku: data.sku || null,
        name: data.name || null,
        oldImage: data.image_url || null,
        newImage: match.image,
        reason: match.reason,
      });
    }
  });

  const outDir = path.resolve(__dirname, '..', '..', 'tmp');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'nova-anoxomat-image-normalization.json');
  fs.writeFileSync(outPath, JSON.stringify({ changedAt: new Date().toISOString(), changes }, null, 2));

  console.log(`updated_products ${changes.length}`);
  console.log(`report ${outPath}`);
  console.log(JSON.stringify(changes.slice(0, 25), null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
