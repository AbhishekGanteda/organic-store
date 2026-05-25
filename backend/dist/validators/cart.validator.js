"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body } = require('express-validator');
const cartValidator = [
    body('productId').notEmpty().withMessage('Product id is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
module.exports = { cartValidator };
//# sourceMappingURL=cart.validator.js.map