const db = require('../../db/knex');

const PRODUCT_FIELDS = [
  { field_key: 'sku', field_label: 'Part Number / SKU', field_type: 'text', is_required: true, sort_order: 1 },
  { field_key: 'name', field_label: 'Product Name', field_type: 'text', is_required: true, sort_order: 2 },
  { field_key: 'short_description', field_label: 'Short Description', field_type: 'textarea', is_required: false, sort_order: 3 },
  { field_key: 'description', field_label: 'Full Description', field_type: 'rich_text', is_required: false, sort_order: 4 },
  { field_key: 'how_to_use', field_label: 'How to Use', field_type: 'rich_text', is_required: false, sort_order: 5 },
  { field_key: 'specifications', field_label: 'Technical Specifications', field_type: 'rich_text', is_required: false, sort_order: 6 },
  { field_key: 'image_url', field_label: 'Product Image URL', field_type: 'image_url', is_required: false, sort_order: 7 },
  { field_key: 'category', field_label: 'Category', field_type: 'text', is_required: false, sort_order: 8 },
  { field_key: 'brand', field_label: 'Brand / Manufacturer', field_type: 'text', is_required: false, sort_order: 9 },
  { field_key: 'cas_number', field_label: 'CAS Number', field_type: 'text', is_required: false, sort_order: 10 },
  { field_key: 'datasheet_url', field_label: 'Datasheet PDF URL', field_type: 'url', is_required: false, sort_order: 11 },
  { field_key: 'video_url', field_label: 'Product Video URL', field_type: 'url', is_required: false, sort_order: 12 },
  { field_key: 'safety_info', field_label: 'Safety Information', field_type: 'rich_text', is_required: false, sort_order: 13 },
  { field_key: 'storage_conditions', field_label: 'Storage Conditions', field_type: 'text', is_required: false, sort_order: 14 },
  { field_key: 'package_size', field_label: 'Package Size / Unit', field_type: 'text', is_required: false, sort_order: 15 },
];

async function seed() {
  await db('product_fields')
    .insert(PRODUCT_FIELDS)
    .onConflict('field_key')
    .merge(['field_label', 'field_type', 'is_required', 'sort_order']);

  await db.destroy();
}

seed().catch(async (err) => {
  await db.destroy();
  console.error('Seed failed:', err);
  process.exit(1);
});
