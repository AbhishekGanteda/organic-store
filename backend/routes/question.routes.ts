import express from 'express';
import { getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion, } from '../controllers/question.controller';
import { questionValidator } from '../validators/question.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getAllQuestions).post(protect, admin, questionValidator, validateRequest, createQuestion);
router.route('/:id').get(getQuestionById).put(protect, admin, questionValidator, validateRequest, updateQuestion).delete(protect, admin, deleteQuestion);

export default router;
