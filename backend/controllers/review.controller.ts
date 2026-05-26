import asyncHandler from '../middleware/async-handler';
import Review from '../models/Review';

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ id: 1 }).lean();
  res.json(reviews);
});

const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ id: Number(req.params.id) }).lean();
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  res.json(review);
});

const createReview = asyncHandler(async (req, res) => {
  const existing = await Review.findOne().sort({ id: -1 });
  const nextId = existing ? existing.id + 1 : 1;

  const review = await Review.create({
    id: nextId,
    name: req.body.name,
    image: req.body.image,
    review: req.body.review,
    rating: req.body.rating,
  });

  res.status(201).json(review);
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ id: Number(req.params.id) });
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.name = req.body.name ?? review.name;
  review.image = req.body.image ?? review.image;
  review.review = req.body.review ?? review.review;
  review.rating = req.body.rating ?? review.rating;

  const updated = await review.save();
  res.json(updated);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ id: Number(req.params.id) });
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await review.deleteOne();
  res.json({ message: 'Review removed' });
});

export { getAllReviews, getReviewById, createReview, updateReview, deleteReview };
