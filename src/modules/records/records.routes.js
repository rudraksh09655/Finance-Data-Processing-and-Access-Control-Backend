const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const { validate, createRecordSchema, updateRecordSchema } = require('./records.validator');
const ctrl = require('./records.controller');

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of financial records
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied
 */
router.get('/', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single financial record by ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial record found
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (ADMIN only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 example: "2024-01-15T00:00:00.000Z"
 *               notes:
 *                 type: string
 *                 example: January salary
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied - ADMIN only
 */
router.post('/', authenticate, authorize('ADMIN'), validate(createRecordSchema), ctrl.createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record (ADMIN only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied - ADMIN only
 *       404:
 *         description: Record not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateRecordSchema), ctrl.updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a financial record (ADMIN only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied - ADMIN only
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deleteRecord);

module.exports = router;