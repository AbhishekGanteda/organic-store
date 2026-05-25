const { body } = require('express-validator');

const featureValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('icon').trim().notEmpty().withMessage('Icon is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

module.exports = { featureValidator };
