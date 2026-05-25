"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body } = require('express-validator');
const questionValidator = [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    body('isOpen').optional().isBoolean().withMessage('isOpen must be a boolean'),
];
module.exports = { questionValidator };
//# sourceMappingURL=question.validator.js.map