"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body } = require('express-validator');
const categoryValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('image').trim().notEmpty().withMessage('Image is required'),
];
module.exports = { categoryValidator };
//# sourceMappingURL=category.validator.js.map