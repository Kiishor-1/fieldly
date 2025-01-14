const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Access is allowed only for admins',
        });
    }
    next();
};

module.exports.isAdmin = isAdmin;
