"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, } = require('../controllers/question.controller');
const { questionValidator } = require('../validators/question.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();
router.route('/').get(getAllQuestions).post(protect, admin, questionValidator, validateRequest, createQuestion);
router.route('/:id').get(getQuestionById).put(protect, admin, questionValidator, validateRequest, updateQuestion).delete(protect, admin, deleteQuestion);
module.exports = router;
//# sourceMappingURL=question.routes.js.map