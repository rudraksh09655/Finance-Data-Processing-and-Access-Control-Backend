const prisma = require('../../config/db');

const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true, name: true, email: true,
            role: true, status: true, createdAt: true,
        },
    });

    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    return user;
};

const updateUserRole = async (id, role) => {
    await getUserById(id); // will throw if not found
    return prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
};

const updateUserStatus = async (id, status) => {
    await getUserById(id);
    return prisma.user.update({
        where: { id },
        data: { status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
};

const deleteUser = async (id) => {
    await getUserById(id);
    return prisma.user.delete({ where: { id } });
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus, deleteUser };