const prisma = require('../../config/db');

// ALL roles
const getSummary = async () => {
    const [income, expense, totalRecords] = await Promise.all([
        prisma.financialRecord.aggregate({
            where: { type: 'INCOME', isDeleted: false },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.financialRecord.aggregate({
            where: { type: 'EXPENSE', isDeleted: false },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.financialRecord.count({ where: { isDeleted: false } }),
    ]);

    const totalIncome = Number(income._sum.amount) || 0;
    const totalExpense = Number(expense._sum.amount) || 0;

    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        totalRecords,
        incomeCount: income._count,
        expenseCount: expense._count,
    };
};

// ALL roles
const getRecentActivity = async (limit = 5) => {
    return prisma.financialRecord.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        select: {
            id: true, amount: true, type: true,
            category: true, date: true, notes: true, createdAt: true,
        },
    });
};

// ANALYST + ADMIN only
const getCategoryBreakdown = async () => {
    const results = await prisma.financialRecord.groupBy({
        by: ['category', 'type'],
        where: { isDeleted: false },
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: 'desc' } },
    });

    return results.map((r) => ({
        category: r.category,
        type: r.type,
        total: Number(r._sum.amount) || 0,
        count: r._count,
    }));
};

// ANALYST + ADMIN only
const getMonthlyTrends = async () => {
    const results = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(date, 'YYYY-MM') AS month,
      type,
      SUM(amount)::float        AS total,
      COUNT(*)::int             AS count
    FROM "FinancialRecord"
    WHERE "isDeleted" = false
    GROUP BY month, type
    ORDER BY month DESC
    LIMIT 24
  `;

    return results;
};

module.exports = { getSummary, getRecentActivity, getCategoryBreakdown, getMonthlyTrends };