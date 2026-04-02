const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);

    // Prisma known errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'A record with this value already exists',
            data: null,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
            data: null,
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;