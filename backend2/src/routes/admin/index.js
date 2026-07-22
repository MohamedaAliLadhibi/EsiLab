const router = require('express').Router();
const multer = require('multer');
const supplierCtrl = require('../../controllers/admin/supplierController');
const importCtrl = require('../../controllers/admin/importController');
const productCtrl = require('../../controllers/admin/productController');
const dashboardCtrl = require('../../controllers/admin/dashboardController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.get('/dashboard/summary', dashboardCtrl.summary);
router.get('/suppliers', supplierCtrl.list);
router.post('/suppliers', supplierCtrl.create);
router.get('/suppliers/:id', supplierCtrl.show);
router.put('/suppliers/:id', supplierCtrl.update);
router.delete('/suppliers/:id', supplierCtrl.destroy);
router.get('/suppliers/:id/mappings', supplierCtrl.getMappings);
router.put('/suppliers/:id/mappings', supplierCtrl.replaceMappings);
router.post('/suppliers/:id/import', upload.single('file'), importCtrl.upload);
router.get('/suppliers/:id/imports', importCtrl.listLogs);
router.get('/imports/:logId', importCtrl.showLog);
router.get('/products', productCtrl.list);
router.post('/products/manual', productCtrl.createManual);
router.get('/products/:id', productCtrl.show);
router.patch('/products/:id', productCtrl.update);
router.delete('/products/:id', productCtrl.destroy);
router.patch('/products/:id/toggle-active', productCtrl.toggleActive);
router.get('/product-fields', productCtrl.listFields);

module.exports = router;
