class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) {
        statusCode = 500; // Internal Server Error
        message = 'Internal Server Error';
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { errorHandler, ApiError };
