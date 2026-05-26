import { body } from 'express-validator';

const questionValidator = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('isOpen').optional().isBoolean().withMessage('isOpen must be a boolean'),
];

export { questionValidator };
