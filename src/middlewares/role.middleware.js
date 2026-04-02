const { error } = require('../utils/apiResponse');

// Usage: authorize('ADMIN') or authorize('ADMIN', 'ANALYST')
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return error(res, 401, 'Not authenticated.');
        }

        if (!allowedRoles.includes(req.user.role)) {
            return error(
                res,
                403,
                `Access denied. This action requires: ${allowedRoles.join(' or ')} role.`
            );
        }

        next();
    };
};

module.exports = { authorize };