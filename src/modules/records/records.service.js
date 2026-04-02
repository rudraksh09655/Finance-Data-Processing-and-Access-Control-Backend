const prisma = require('../../config/db');

const createRecord = async (data, userId) => {
    return prisma.financialRecord.create({
        data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes || null,
            userId,
        },
    });
};

const getRecords = async (filters = {}) => {
    const where = { isDeleted: false };

    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
    if (filters.from || filters.to) {
        where.date = {};
        if (filters.from) where.date.gte = new Date(filters.from);
        if (filters.to) where.date.lte = new Date(filters.to);
    }

    const page = Math.max(parseInt(filters.page) || 1, 1);
    const limit = Math.min(parseInt(filters.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
        prisma.financialRecord.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.financialRecord.count({ where }),
    ]);

    return {
        records,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getRecordById = async (id) => {
    const record = await prisma.financialRecord.findFirst({
        where: { id, isDeleted: false },
        include: { user: { select: { id: true, name: true } } },
    });

    if (!record) {
        const err = new Error('Financial record not found');
        err.statusCode = 404;
        throw err;
    }

    return record;
};

const updateRecord = async (id, data) => {
    await getRecordById(id); // throws if not found

    return prisma.financialRecord.update({
        where: { id },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
        },
    });
};

const deleteRecord = async (id) => {
    await getRecordById(id);

    // Soft delete — never permanently remove financial data
    return prisma.financialRecord.update({
        where: { id },
        data: { isDeleted: true },
    });
};

module.exports = { createRecord, getRecords, getRecordById, updateRecord, deleteRecord };