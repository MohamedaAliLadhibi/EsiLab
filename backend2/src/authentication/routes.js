const router = require('express').Router();
const authController = require('./authController');
const userController = require('./userController');
const { requireAuth, requireAdmin } = require('./authMiddleware');

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', requireAuth, authController.me);

router.get('/auth/pending-signups', requireAuth, requireAdmin, (req, res, next) => {
  req.query.status = 'pending';
  userController.list(req, res, next);
});
router.patch('/auth/pending-signups/:id/approve', requireAuth, requireAdmin, userController.approve);
router.patch('/auth/pending-signups/:id/reject', requireAuth, requireAdmin, userController.reject);

router.get('/users', requireAuth, requireAdmin, userController.list);
router.post('/users', requireAuth, requireAdmin, userController.create);
router.get('/users/:id', requireAuth, requireAdmin, userController.show);
router.patch('/users/:id', requireAuth, requireAdmin, userController.update);
router.delete('/users/:id', requireAuth, requireAdmin, userController.destroy);

module.exports = router;
