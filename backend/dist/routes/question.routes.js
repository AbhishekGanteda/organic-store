import express from 'express';
import { getAllQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, } from '../controllers/question.controller.js';
import { questionValidator } from '../validators/question.validator.js';
import validateRequest from '../middleware/validate.middleware.js';
import { protect, admin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.route('/').get(getAllQuestions).post(protect, admin, questionValidator, validateRequest, createQuestion);
router.route('/:id').get(getQuestionById).put(protect, admin, questionValidator, validateRequest, updateQuestion).delete(protect, admin, deleteQuestion);
export default router;
//# sourceMappingURL=question.routes.js.map