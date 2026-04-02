const authService = require('./auth.service');
const { success } = require('../../utils/apiResponse');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        return success(res, 201, 'User registered successfully', user);
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return success(res, 200, 'Login successful', result);
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };