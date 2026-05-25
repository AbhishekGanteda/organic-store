"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        return next(new Error('Not authorized, token missing'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            throw new Error('Invalid token');
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401);
            return next(new Error('Not authorized, user not found'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
    }
};
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403);
        return next(new Error('Admin access required'));
    }
};
module.exports = { protect, admin };
//# sourceMappingURL=auth.middleware.js.map