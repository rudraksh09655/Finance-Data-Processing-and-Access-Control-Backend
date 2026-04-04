const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const ctrl = require('./dashboard.controller');

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expense and net balance (ALL roles)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary
 *       401:
 *         description: Not authenticated
 */
router.get('/summary', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getSummary);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent financial activity (ALL roles)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Recent activity list
 *       401:
 *         description: Not authenticated
 */
router.get('/recent', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecentActivity);

/**
 * @swagger
 * /api/dashboard/breakdown:
 *   get:
 *     summary: Get category wise totals (ANALYST and ADMIN only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied
 */
router.get('/breakdown', authenticate, authorize('ADMIN', 'ANALYST'), ctrl.getCategoryBreakdown);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends for last 24 months (ANALYST and ADMIN only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends data
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied
 */
router.get('/trends', authenticate, authorize('ADMIN', 'ANALYST'), ctrl.getMonthlyTrends);

module.exports = router;