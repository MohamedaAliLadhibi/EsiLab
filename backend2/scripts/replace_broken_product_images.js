require('dotenv').config();

const db = require('../src/db/knex');

const replacements = new Map([
  [
    'https://www.novabiomedical.com/up/assets/2019/12/Cryoline_Isolated_800x554_New_Logo.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/Cryoline_Isolated_800x554_New_Logo.png',
  ],
  [
    'https://www.novabiomedical.com/up/assets/2019/12/Anoxomat_800x554_Isolated.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/Anoxomat_800x554_Isolated.png',
  ],
  [
    'https://www.novabiomedical.com/up/assets/2019/12/Standard-Jars-400x220-2.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/Standard-Jars-400x220-2.png',
  ],
  [
    'https://www.novabiomedical.com/up/assets/2019/12/Palladox-400x220-1.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/Palladox-Box-400x220-1.png',
  ],
  [
    'https://www.novabiomedical.com/up/assets/2023/08/FLM300_220x260.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/FLM3000_800x554_New_Logo.png',
  ],
  [
    'https://www.novabiomedical.com/up/assets/2019/12/4250-Cryoscope_New_Logo_220x260_Isolated.png',
    'https://www.novabiomedical.com/inc/uploads/2019/12/4250-Cryoscope_New_Logo_800x544_Isolated.png',
  ],
]);

async function main() {
  const summary = [];

  await db.transaction(async (trx) => {
    const rows = await trx('products').select('id', 'data');

    for (const [oldUrl, newUrl] of replacements) {
      const matchingRows = rows.filter((row) => {
        const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        return data && data.image_url === oldUrl;
      });

      for (const row of matchingRows) {
        const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        await trx('products')
          .where({ id: row.id })
          .update({
            data: JSON.stringify({ ...data, image_url: newUrl }),
            updated_at: trx.fn.now(),
          });
      }

      summary.push({ oldUrl, newUrl, updated: matchingRows.length });
    }
  });

  console.log(JSON.stringify(summary, null, 2));
  console.log(`updated_products ${summary.reduce((sum, row) => sum + row.updated, 0)}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
