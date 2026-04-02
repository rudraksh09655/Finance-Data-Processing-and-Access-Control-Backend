const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 401, 'Access denied. No token provided.');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { userId, role, email }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return error(res, 401, 'Token has expired. Please login again.');
        }
        return error(res, 401, 'Invalid token.');
    }
};

module.exports = { authenticate };