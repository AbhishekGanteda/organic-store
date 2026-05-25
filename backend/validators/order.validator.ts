const { body } = require('express-validator');

const orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Order items are required'),
  body('items.*.product').notEmpty().withMessage('Product id is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
];

module.exports = { orderValidator };
