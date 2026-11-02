const CATEGORIES = [
  { name: 'Equipements Laboratoires', slug: 'equipements-laboratoires' },
  { name: 'Metrologie Dimensionnelle', slug: 'metrologie-dimensionnelle' },
  { name: 'Inspection & Emballage', slug: 'inspection-emballage' },
  { name: 'Produits Chimiques & Reactifs', slug: 'produits-chimiques-reactifs' },
];

exports.up = async function (knex) {
  await knex('categories')
    .insert(CATEGORIES.map((category) => ({ ...category, parent_id: null })))
    .onConflict('slug')
    .merge(['name', 'parent_id', 'updated_at']);

  // Preserve already-normalized category assignments and backfill products
  // from their existing name, description, and supplier category fields.
  await knex.raw(`
    WITH product_text AS (
      SELECT p.id,
        lower(concat_ws(' ',
          p.data->>'name', p.data->>'product_name', p.data->>'title', p.data->>'sku',
          p.data->>'short_description', p.data->>'description', p.data->>'specifications',
          p.data->>'brand', p.data->>'manufacturer', p.data->>'category'
        )) AS text,
        p.data->>'category_slug' AS existing_slug,
        p.data->>'cas_number' AS cas_number
      FROM products p
    ), classified AS (
      SELECT id,
        CASE
          WHEN existing_slug IN (
            'equipements-laboratoires', 'metrologie-dimensionnelle',
            'inspection-emballage', 'produits-chimiques-reactifs'
          ) THEN existing_slug
          WHEN text ~ '(reactif|reagent|chemical|chimique|solvent|solvant|buffer|tampon|media|milieu de culture)'
            OR coalesce(cas_number, '') <> '' THEN 'produits-chimiques-reactifs'
          WHEN text ~ '(inspection|packaging|emballage|conditionnement|traceability|tracabilite|vision system|visual inspection|labeler|etiqueteuse)'
            THEN 'inspection-emballage'
          WHEN text ~ '(caliper|pied a coulisse|micrometer|micrometre|gauge block|jauge|dimensional|dimensionnel|metrology|metrologie|calibration weight|test weight|weight set|masse etalon|poids de calibration)'
            THEN 'metrologie-dimensionnelle'
          WHEN text ~ '(laboratory|laboratoire|centrifuge|viscometer|viscosimeter|viscosimetre|microscope|incubator|incubateur|oven|etuve|hood|hotte|analyzer|analyseur|balance|pipette|spectrophotometer|spectrophotometre|cryoscope|autoclave|stirrer|agitateur|bath|bain thermostat|microbiology|microbiologie)'
            THEN 'equipements-laboratoires'
          ELSE NULL
        END AS slug
      FROM product_text
    )
    UPDATE products p
    SET data = p.data || jsonb_build_object('category_slug', classified.slug),
        updated_at = now()
    FROM classified
    WHERE p.id = classified.id AND classified.slug IS NOT NULL
  `);

  await knex.raw(`
    DELETE FROM product_categories pc
    USING products p
    WHERE pc.product_id = p.id
      AND p.data->>'category_slug' IN (
        'equipements-laboratoires', 'metrologie-dimensionnelle',
        'inspection-emballage', 'produits-chimiques-reactifs'
      )
  `);

  await knex.raw(`
    INSERT INTO product_categories (product_id, category_id)
    SELECT p.id, c.id
    FROM products p
    JOIN categories c ON c.slug = p.data->>'category_slug'
    WHERE p.data->>'category_slug' IN (
      'equipements-laboratoires', 'metrologie-dimensionnelle',
      'inspection-emballage', 'produits-chimiques-reactifs'
    )
    ON CONFLICT (product_id, category_id) DO NOTHING
  `);
};

exports.down = async function (knex) {
  await knex('product_categories')
    .whereIn('category_id', knex('categories').select('id').whereIn('slug', CATEGORIES.map((category) => category.slug)))
    .delete();
  await knex('categories').whereIn('slug', CATEGORIES.map((category) => category.slug)).delete();
  await knex.raw(`
    UPDATE products
    SET data = data - 'category_slug', updated_at = now()
    WHERE data->>'category_slug' IN (?, ?, ?, ?)
  `, CATEGORIES.map((category) => category.slug));
};
