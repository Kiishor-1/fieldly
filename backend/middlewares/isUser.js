const isUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'User') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Access is allowed only for users',
        });
    }
    next();
};

module.exports.isUser = isUser;
