import express from 'express';
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview, } from '../controllers/review.controller.js';
import { reviewValidator } from '../validators/review.validator.js';
import validateRequest from '../middleware/validate.middleware.js';
import { protect, admin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.route('/').get(getAllReviews).post(protect, admin, reviewValidator, validateRequest, createReview);
router.route('/:id').get(getReviewById).put(protect, admin, reviewValidator, validateRequest, updateReview).delete(protect, admin, deleteReview);
export default router;
//# sourceMappingURL=review.routes.js.map