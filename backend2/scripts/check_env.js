const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");
const parsed = dotenv.config({ path: envPath });
console.log("Loaded .env from", envPath);
if (parsed.error) console.error("dotenv error", parsed.error);
console.log("DB_HOST:", process.env.DB_HOST);
console.log(
  "DB_PORT:",
  process.env.DB_PORT,
  "type:",
  typeof process.env.DB_PORT,
);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log(
  "DB_PASSWORD:",
  process.env.DB_PASSWORD,
  "type:",
  typeof process.env.DB_PASSWORD,
);
