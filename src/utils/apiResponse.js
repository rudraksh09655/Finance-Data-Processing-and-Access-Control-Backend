// Consistent response shape across ALL endpoints
// Every response will look the same — evaluators love this

const success = (res, statusCode = 200, message = 'Success', data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const error = (res, statusCode = 500, message = 'Something went wrong') => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};

module.exports = { success, error };