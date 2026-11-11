// src/routes/public/index.js
const router = require('express').Router();
const catalogueCtrl = require('../../controllers/public/catalogueController');

// ── Products ───────────────────────────────────────────────────────────────
router.get('/products/sitemap',                 catalogueCtrl.sitemapProducts);
router.get('/products/summary',                 catalogueCtrl.summary);
router.get('/products',                        catalogueCtrl.list);
router.get('/products/:slug',                  catalogueCtrl.show);

// ── Categories ─────────────────────────────────────────────────────────────
router.get('/categories',                      catalogueCtrl.categories);
router.get('/categories/:slug/products',       catalogueCtrl.categoryProducts);

module.exports = router;
