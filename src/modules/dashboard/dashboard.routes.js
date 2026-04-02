const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const ctrl = require('./dashboard.controller');

// ALL roles — basic data
router.get('/summary', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getSummary);
router.get('/recent', authenticate, authorize('ADMIN', 'ANALYST', 'VIEWER'), ctrl.getRecentActivity);

// ANALYST + ADMIN — advanced insights
router.get('/breakdown', authenticate, authorize('ADMIN', 'ANALYST'), ctrl.getCategoryBreakdown);
router.get('/trends', authenticate, authorize('ADMIN', 'ANALYST'), ctrl.getMonthlyTrends);

module.exports = router;