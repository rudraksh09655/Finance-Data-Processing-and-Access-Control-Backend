const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            data: result.error.flatten().fieldErrors,
        });
    }
    req.body = result.data;
    next();
};

module.exports = { registerSchema, loginSchema, validate };