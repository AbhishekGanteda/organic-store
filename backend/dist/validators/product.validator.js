"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body } = require('express-validator');
const productValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('image').trim().notEmpty().withMessage('Image is required'),
    body('rating').optional().isNumeric().withMessage('Rating must be a number'),
];
module.exports = { productValidator };
//# sourceMappingURL=product.validator.js.map