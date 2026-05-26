import express from 'express';
import { getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview, } from '../controllers/review.controller';
import { reviewValidator } from '../validators/review.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').get(getAllReviews).post(protect, admin, reviewValidator, validateRequest, createReview);
router.route('/:id').get(getReviewById).put(protect, admin, reviewValidator, validateRequest, updateReview).delete(protect, admin, deleteReview);

export default router;
