const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.name,
        message: err.message,
        details: err.errors || []
    });
};

module.exports = errorHandler;
