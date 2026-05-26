import { body } from 'express-validator';
const cartValidator = [
    body('productId').notEmpty().withMessage('Product id is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
export { cartValidator };
//# sourceMappingURL=cart.validator.js.map