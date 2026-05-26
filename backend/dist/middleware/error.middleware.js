const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err?.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
    });
};
export default errorHandler;
//# sourceMappingURL=error.middleware.js.map