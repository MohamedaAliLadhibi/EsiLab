# Lab Catalogue API

Multi-supplier laboratory equipment catalogue backend built with Node.js, Express, PostgreSQL, and Knex.

## Services

- Public API: port 3000, read-only catalogue endpoints.
- Admin API: port 3001, catalogue management for suppliers, products, field mappings, and imports.

## Quick Start

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
node src/server.js
node src/adminServer.js
```

Set the database and storage values in `.env` before running migrations.

## Admin API

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard/summary` | Dashboard summary |
| GET/POST | `/admin/suppliers` | List or create suppliers |
| GET/PUT/DELETE | `/admin/suppliers/:id` | Manage a supplier |
| GET/PUT | `/admin/suppliers/:id/mappings` | View or replace field mappings |
| POST | `/admin/suppliers/:id/import` | Upload an Excel file |
| GET | `/admin/suppliers/:id/imports` | Import history |
| GET | `/admin/imports/:logId` | Import log detail |
| GET | `/admin/products` | List products |
| POST | `/admin/products/manual` | Create a product |
| GET/PATCH/DELETE | `/admin/products/:id` | Manage a product |
| PATCH | `/admin/products/:id/toggle-active` | Enable or disable a product |
| GET | `/admin/product-fields` | Master field catalog |

## Public API

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List products |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/categories` | List categories |
| GET | `/api/categories/:slug/products` | Products in a category |

## Tests

```bash
npm test
```
