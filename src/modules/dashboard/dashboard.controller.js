const dashboardService = require('./dashboard.service');
const { success } = require('../../utils/apiResponse');

const getSummary = async (req, res, next) => {
    try {
        const data = await dashboardService.getSummary();
        return success(res, 200, 'Dashboard summary fetched', data);
    } catch (err) { next(err); }
};

const getRecentActivity = async (req, res, next) => {
    try {
        const limit = req.query.limit || 5;
        const data = await dashboardService.getRecentActivity(limit);
        return success(res, 200, 'Recent activity fetched', data);
    } catch (err) { next(err); }
};

const getCategoryBreakdown = async (req, res, next) => {
    try {
        const data = await dashboardService.getCategoryBreakdown();
        return success(res, 200, 'Category breakdown fetched', data);
    } catch (err) { next(err); }
};

const getMonthlyTrends = async (req, res, next) => {
    try {
        const data = await dashboardService.getMonthlyTrends();
        return success(res, 200, 'Monthly trends fetched', data);
    } catch (err) { next(err); }
};

module.exports = { getSummary, getRecentActivity, getCategoryBreakdown, getMonthlyTrends };