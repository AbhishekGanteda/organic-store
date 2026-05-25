"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body, oneOf } = require('express-validator');
const registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const updateProfileValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];
const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    oneOf([
        body('password').notEmpty(),
        body('encryptedPassword').notEmpty(),
    ], 'Password is required'),
];
module.exports = { registerValidator, loginValidator, updateProfileValidator };
//# sourceMappingURL=auth.validator.js.map