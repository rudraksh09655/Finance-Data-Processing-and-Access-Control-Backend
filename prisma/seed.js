const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.financialRecord.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create one of each role
    const admin = await prisma.user.create({
        data: { name: 'Admin User', email: 'admin@finance.com', password: hashedPassword, role: 'ADMIN' },
    });
    const analyst = await prisma.user.create({
        data: { name: 'Analyst User', email: 'analyst@finance.com', password: hashedPassword, role: 'ANALYST' },
    });
    await prisma.user.create({
        data: { name: 'Viewer User', email: 'viewer@finance.com', password: hashedPassword, role: 'VIEWER' },
    });

    // Create sample financial records
    const categories = ['Salary', 'Rent', 'Food', 'Marketing', 'Software', 'Travel'];
    const records = [];

    for (let i = 0; i < 30; i++) {
        const isIncome = i % 3 === 0;
        records.push({
            amount: isIncome ? (Math.random() * 5000 + 1000).toFixed(2) : (Math.random() * 1000 + 100).toFixed(2),
            type: isIncome ? 'INCOME' : 'EXPENSE',
            category: categories[i % categories.length],
            date: new Date(2024, Math.floor(i / 3), (i % 28) + 1),
            notes: `Sample record ${i + 1}`,
            userId: i % 2 === 0 ? admin.id : analyst.id,
        });
    }

    await prisma.financialRecord.createMany({ data: records });

    console.log('✅ Seed complete!');
    console.log('📧 admin@finance.com    | password: password123 | role: ADMIN');
    console.log('📧 analyst@finance.com  | password: password123 | role: ANALYST');
    console.log('📧 viewer@finance.com   | password: password123 | role: VIEWER');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());