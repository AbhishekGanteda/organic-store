import { body } from 'express-validator';

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('image').trim().notEmpty().withMessage('Image is required'),
];

export { categoryValidator };
