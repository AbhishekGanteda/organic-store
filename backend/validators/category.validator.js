const { body } = require('express-validator');

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('image').trim().notEmpty().withMessage('Image is required'),
];

module.exports = { categoryValidator };
