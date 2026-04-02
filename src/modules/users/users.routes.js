const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const ctrl = require('./users.controller');

// All user management is ADMIN only
router.use(authenticate, authorize('ADMIN'));

router.get('/', ctrl.getAllUsers);
router.get('/:id', ctrl.getUserById);
router.patch('/:id/role', ctrl.updateUserRole);
router.patch('/:id/status', ctrl.updateUserStatus);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;