jest.mock('../models/Review', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

import Review from '../models/Review';
import { getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview, } from '../controllers/review.controller';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const waitForAsyncHandler = () => new Promise(resolve => {
  setImmediate(resolve);
});

describe('review.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all reviews sorted by id', async () => {
    const req = {};
    const res = createRes();
    const next = jest.fn();

    const lean = jest.fn().mockResolvedValue([{ id: 1, name: 'n' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Review.find.mockReturnValue({ sort });

    getAllReviews(req, res, next);
    await waitForAsyncHandler();

    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'n' }]);
  });

  it('returns 404 when review is missing', async () => {
    const req = { params: { id: '7' } };
    const res = createRes();
    const next = jest.fn();

    Review.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    getReviewById(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Review not found');
  });

  it('creates review with incremented id', async () => {
    const req = { body: { name: 'r', image: 'i', review: 'great', rating: 5 } };
    const res = createRes();
    const next = jest.fn();

    Review.findOne.mockReturnValue({ sort: jest.fn().mockResolvedValue({ id: 1 }) });
    Review.create.mockResolvedValue({ id: 2, ...req.body });

    createReview(req, res, next);
    await waitForAsyncHandler();

    expect(Review.create).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updates and deletes review', async () => {
    const updateReq = { params: { id: '2' }, body: { rating: 4 } };
    const res = createRes();
    const next = jest.fn();

    const doc = {
      name: 'n',
      image: 'i',
      review: 'x',
      rating: 5,
      save: jest.fn().mockResolvedValue({ id: 2, rating: 4 }),
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };

    Review.findOne.mockResolvedValueOnce(doc).mockResolvedValueOnce(doc);

    updateReview(updateReq, res, next);
    await waitForAsyncHandler();

    expect(doc.rating).toBe(4);

    const delReq = { params: { id: '2' } };
    deleteReview(delReq, res, next);
    await waitForAsyncHandler();

    expect(doc.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenLastCalledWith({ message: 'Review removed' });
  });
});
