exports.up = async function (knex) {
  const categorySlugs = [
    'equipements-laboratoires', 'metrologie-dimensionnelle',
    'inspection-emballage', 'produits-chimiques-reactifs',
  ];

  await knex('product_categories')
    .whereIn('category_id', knex('categories').select('id').whereIn('slug', categorySlugs))
    .delete();
  await knex('products').whereRaw("data->>'category_slug' IS NOT NULL")
    .update({ data: knex.raw("data - 'category_slug'") });

  await knex.raw(`
    WITH product_text AS (
      SELECT p.id,
        lower(concat_ws(' ',
          p.data->>'name', p.data->>'product_name', p.data->>'title', p.data->>'sku',
          p.data->>'short_description', p.data->>'description', p.data->>'specifications',
          p.data->>'brand', p.data->>'manufacturer', p.data->>'category', s.name
        )) AS text,
        p.data->>'cas_number' AS cas_number
      FROM products p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
    ), classified AS (
      SELECT id,
        CASE
          WHEN coalesce(cas_number, '') <> ''
            OR text ~ '(reactif|reagent|chemical|chimique|solvent|solvant|buffer|tampon|culture medium|culture media|consumable|consommable|pipette tips?|tips? for pipettes|microtubes?|test tubes?|vials?|bottles?|reservoirs?|multiwell plates?)'
            THEN 'produits-chimiques-reactifs'
          WHEN text ~ '(inspection|packaging|emballage|conditionnement|traceability|tracabilite|vision system|visual inspection|labeler|etiqueteuse)'
            THEN 'inspection-emballage'
          WHEN text ~ '(caliper|pied a coulisse|micrometer|micrometre|gauge block|jauge|dimensional|dimensionnel|metrology|metrologie|calibration weight|test weight|weight set|masse etalon|poids de calibration)'
            THEN 'metrologie-dimensionnelle'
          WHEN text ~ '(equipment|equipement|instrumentation|laboratory|laboratoires?|centrifuge|viscometer|viscosimeter|viscosimetre|microscope|incubator|incubateur|oven|etuve|hood|hotte|analyzer|analyseur|balance|pipette|spectrophotometer|spectrophotometre|cryoscope|autoclave|stirrer|agitateur|bath|bain thermostat|microbiology|microbiologie|charger|carousel|holder|accessories|accessory|rotor|adapter|power supply|spare parts?|printer|stand|rack)'
            OR text ~ '(memmert|mermmet|precisa)'
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
    INSERT INTO product_categories (product_id, category_id)
    SELECT p.id, c.id
    FROM products p
    JOIN categories c ON c.slug = p.data->>'category_slug'
    WHERE p.data->>'category_slug' IN (?, ?, ?, ?)
    ON CONFLICT (product_id, category_id) DO NOTHING
  `, categorySlugs);
};

exports.down = async function (knex) {
  await knex('product_categories')
    .whereIn('category_id', knex('categories').select('id').whereIn('slug', [
      'equipements-laboratoires', 'metrologie-dimensionnelle',
      'inspection-emballage', 'produits-chimiques-reactifs',
    ]))
    .delete();
  await knex('products').whereRaw("data->>'category_slug' IS NOT NULL")
    .update({ data: knex.raw("data - 'category_slug'") });
};
