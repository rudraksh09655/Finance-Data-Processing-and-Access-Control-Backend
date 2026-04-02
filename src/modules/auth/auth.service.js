const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');

const register = async ({ name, email, password, role }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error('Email is already registered');
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'VIEWER',
        },
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
};

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    if (user.status === 'INACTIVE') {
        const err = new Error('Your account has been deactivated. Contact admin.');
        err.statusCode = 403;
        throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = { register, login };