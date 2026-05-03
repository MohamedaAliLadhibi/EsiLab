# Lab Catalogue API

Multi-supplier laboratory equipment catalogue backend.  
Built with **Node.js / Express / PostgreSQL / Knex**.

---

## Architecture

```
┌─────────────────────────────────┐    ┌──────────────────────────────────┐
│  PUBLIC API  (port 3000)        │    │  ADMIN API  (port 3001)          │
│  catalogue.com                  │    │  admin.catalogue.com             │
│                                 │    │                                  │
│  GET /api/products              │    │  All routes require:             │
│  GET /api/products/:slug        │    │  • IP whitelist                  │
│  GET /api/categories            │    │  • Bearer API key                │
│  GET /api/categories/:slug/...  │    │                                  │
│                                 │    │  CRUD: suppliers, products,      │
│  Read-only. No auth.            │    │  field mappings, Excel import    │
│  Heavily cacheable.             │    │                                  │
└────────────────┬────────────────┘    └──────────────┬───────────────────┘
                 │                                     │
                 └──────────────┬──────────────────────┘
                                │  Shared PostgreSQL DB
                                │  (Admin is the only writer)
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DB credentials and a strong ADMIN_API_KEY

# 3. Create the database
createdb lab_catalogue

# 4. Run migrations
npm run migrate

# 5. Seed product fields master catalog
npm run seed

# 6. Start both servers
node src/server.js      # Public API  → :3000
node src/adminServer.js # Admin API   → :3001

# Development (auto-reload)
npx nodemon src/server.js
npx nodemon src/adminServer.js
```

---

## Admin Workflow

### 1 — Add a Supplier
```http
POST /admin/suppliers
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{
  "name": "Nova",
  "contact_email": "nova@example.com",
  "header_row_number": 1
}
```

### 2 — Configure Field Mappings
```http
PUT /admin/suppliers/:id/mappings
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{
  "mappings": [
    { "field_id": 1, "source_column": "A" },  // sku  → column A
    { "field_id": 2, "source_column": "B" },  // name → column B
    { "field_id": 8, "source_column": "C" }   // category → column C
  ]
}
```

### 3 — Import an Excel File
```http
POST /admin/suppliers/:id/import
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: multipart/form-data

file=<Excel file>
```

Response:
```json
{
  "message": "Import completed.",
  "importLogId": 1,
  "inserted": 120,
  "updated": 0,
  "skipped": 3,
  "rowErrors": []
}
```

---

## Key Design Decisions

| Decision | Reason |
|---|---|
| `jsonb` for `products.data` | Each supplier has different fields — no fixed schema |
| GIN index on `products.data` | Fast full-text search across the JSON payload |
| Functional index on `data->>'sku'` | O(1) lookup during re-import upsert |
| Prices stripped at parse time | Belt-and-suspenders: unmapped cols ignored + regex filter |
| Two servers (public / admin) | Public site has zero attack surface — no auth code at all |
| Knex migrations | Version-controlled schema, easy rollback |

---

## API Reference

### Public (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List products (paginated, searchable) |
| GET | `/api/products/:slug` | Product detail with field metadata |
| GET | `/api/categories` | All categories |
| GET | `/api/categories/:slug/products` | Products in a category |

Query params for listing: `?page=1&limit=24&search=centrifuge&category_id=3`

### Admin (Bearer token required)

| Method | Path | Description |
|---|---|---|
| GET/POST | `/admin/suppliers` | List / create suppliers |
| GET/PUT/DELETE | `/admin/suppliers/:id` | Show / update / delete supplier |
| GET/PUT | `/admin/suppliers/:id/mappings` | View / replace field mappings |
| POST | `/admin/suppliers/:id/import` | Upload Excel file |
| GET | `/admin/suppliers/:id/imports` | Import history |
| GET | `/admin/imports/:logId` | Single import log detail |
| GET | `/admin/products` | List all products (admin view) |
| PATCH | `/admin/products/:id` | Edit product data or active status |
| DELETE | `/admin/products/:id` | Hard delete product |
| PATCH | `/admin/products/:id/toggle-active` | Soft enable/disable |
| GET | `/admin/product-fields` | Master field catalog |

---

## Running Tests

```bash
npm test
```

Tests cover the `ImportService` parsing logic including:
- Correct field mapping and column resolution
- Section header / empty row skipping  
- Price stripping (belt-and-suspenders)
- Multi-row header offset (Eppendorf-style files)
- Missing SKU mapping guard
