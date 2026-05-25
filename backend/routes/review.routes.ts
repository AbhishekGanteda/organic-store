const express = require('express');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const { reviewValidator } = require('../validators/review.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/').get(getAllReviews).post(protect, admin, reviewValidator, validateRequest, createReview);
router.route('/:id').get(getReviewById).put(protect, admin, reviewValidator, validateRequest, updateReview).delete(protect, admin, deleteReview);

module.exports = router;
