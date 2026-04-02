const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const { validate, createRecordSchema, updateRecordSchema } = require('./records.validator');
const ctrl = require('./records.controller');

// VIEWER + ANALYST + ADMIN — read access
router.get('/', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecords);
router.get('/:id', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecordById);

// ADMIN only — write access
router.post('/', authenticate, authorize('ADMIN'), validate(createRecordSchema), ctrl.createRecord);
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateRecordSchema), ctrl.updateRecord);
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deleteRecord);

module.exports = router;