const { z } = require('zod');

const createRecordSchema = z.object({
    amount: z.number().positive('Amount must be a positive number'),
    type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Type must be INCOME or EXPENSE' }),
    category: z.string().min(1, 'Category is required').max(50),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
    notes: z.string().max(500, 'Notes too long').optional(),
});

const updateRecordSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1).max(50).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional(),
    notes: z.string().max(500).optional(),
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

module.exports = { createRecordSchema, updateRecordSchema, validate };