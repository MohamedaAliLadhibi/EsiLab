const { Client } = require("pg");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 AS ok");
    console.log("Query result:", res.rows);
  } catch (err) {
    console.error("pg client error:", err);
  } finally {
    await client.end();
  }
}

run();
