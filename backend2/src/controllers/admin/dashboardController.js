const db = require('../../db/knex');

exports.summary = async (_req, res, next) => {
  try {
    const [
      suppliers,
      productCountRows,
      importStatsRows,
      recentImports,
    ] = await Promise.all([
      db('suppliers').orderBy('name'),
      db('products').where({ is_active: true }).count('id as total'),
      db('import_logs')
        .select(
          db.raw('count(*)::int as total_imports'),
          db.raw("count(*) filter (where status = 'failed')::int as failed_imports"),
        ),
      db('import_logs as l')
        .leftJoin('suppliers as s', 's.id', 'l.supplier_id')
        .select('l.*', 's.name as supplier_name')
        .orderBy('l.created_at', 'desc')
        .limit(5),
    ]);

    res.json({
      data: {
        suppliers,
        totals: {
          products: Number(productCountRows[0]?.total || 0),
          suppliers: suppliers.length,
          activeSuppliers: suppliers.filter((supplier) => supplier.is_active).length,
          imports: Number(importStatsRows[0]?.total_imports || 0),
          failedImports: Number(importStatsRows[0]?.failed_imports || 0),
        },
        recentImports,
      },
    });
  } catch (err) {
    next(err);
  }
};
