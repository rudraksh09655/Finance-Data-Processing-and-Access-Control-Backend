const usersService = require('./users.service');
const { success } = require('../../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAllUsers();
        return success(res, 200, 'Users fetched successfully', users);
    } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        return success(res, 200, 'User fetched successfully', user);
    } catch (err) { next(err); }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role', data: null });
        }
        const user = await usersService.updateUserRole(req.params.id, role);
        return success(res, 200, 'User role updated successfully', user);
    } catch (err) { next(err); }
};

const updateUserStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['ACTIVE', 'INACTIVE'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status', data: null });
        }
        const user = await usersService.updateUserStatus(req.params.id, status);
        return success(res, 200, 'User status updated successfully', user);
    } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
    try {
        await usersService.deleteUser(req.params.id);
        return success(res, 200, 'User deleted successfully', null);
    } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus, deleteUser };