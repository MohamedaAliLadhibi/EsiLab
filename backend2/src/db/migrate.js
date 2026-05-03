// src/db/migrate.js
require('dotenv').config();
const knex = require('./knex');

const command = process.argv[2];

async function run() {
  try {
    if (command === 'rollback') {
      console.log('⏪  Rolling back last migration batch...');
      const [count] = await knex.migrate.rollback();
      console.log(`✅  Rolled back ${count} migration(s).`);
    } else {
      console.log('⬆️   Running migrations...');
      const [batchNo, log] = await knex.migrate.latest();
      if (log.length === 0) {
        console.log('✅  Already up to date.');
      } else {
        console.log(`✅  Batch ${batchNo} — ran ${log.length} migration(s):`);
        log.forEach((file) => console.log(`     • ${file}`));
      }
    }
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

run();
