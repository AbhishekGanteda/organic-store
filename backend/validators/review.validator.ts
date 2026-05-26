import { body } from 'express-validator';

const reviewValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('review').trim().notEmpty().withMessage('Review text is required'),
  body('rating').isNumeric().withMessage('Rating is required'),
];

export { reviewValidator };