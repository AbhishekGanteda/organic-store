jest.mock('../models/Category', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn(),
    },
  },
}));

import Category from '../models/Category.js';
import mongoose from 'mongoose';
import { getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory, } from '../controllers/category.controller.js';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const waitForAsyncHandler = () => new Promise(resolve => {
  setImmediate(resolve);
});

describe('category.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all categories', async () => {
    const req = {};
    const res = createRes();
    const next = jest.fn();

    const lean = jest.fn().mockResolvedValue([{ id: 1, name: 'cat' }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Category.find.mockReturnValue({ sort });

    getAllCategories(req, res, next);
    await waitForAsyncHandler();

    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'cat' }]);
  });

  it('gets category by numeric id', async () => {
    const req = { params: { id: '3' } };
    const res = createRes();
    const next = jest.fn();

    Category.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ id: 3 }) });

    getCategoryById(req, res, next);
    await waitForAsyncHandler();

    expect(Category.findOne).toHaveBeenCalledWith({ id: 3 });
    expect(res.json).toHaveBeenCalledWith({ id: 3 });
  });

  it('gets category by object id', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = createRes();
    const next = jest.fn();

    mongoose.Types.ObjectId.isValid.mockReturnValue(true);
    Category.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: req.params.id }) });

    getCategoryById(req, res, next);
    await waitForAsyncHandler();

    expect(Category.findById).toHaveBeenCalledWith(req.params.id);
  });

  it('returns 404 when category is not found', async () => {
    const req = { params: { id: 'abc-not-found' } };
    const res = createRes();
    const next = jest.fn();

    mongoose.Types.ObjectId.isValid.mockReturnValue(false);

    getCategoryById(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Category not found');
  });

  it('creates category with incremented id', async () => {
    const req = { body: { name: 'Cat', image: 'img' } };
    const res = createRes();
    const next = jest.fn();

    Category.findOne.mockReturnValue({ sort: jest.fn().mockResolvedValue({ id: 2 }) });
    Category.create.mockResolvedValue({ id: 3, ...req.body });

    createCategory(req, res, next);
    await waitForAsyncHandler();

    expect(Category.create).toHaveBeenCalledWith(expect.objectContaining({ id: 3 }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('updates and deletes category by numeric id', async () => {
    const res = createRes();
    const next = jest.fn();

    const doc = {
      name: 'Old',
      image: 'old',
      description: 'old',
      save: jest.fn().mockResolvedValue({ id: 3, name: 'New' }),
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };

    Category.findOne.mockResolvedValueOnce(doc).mockResolvedValueOnce(doc);

    updateCategory({ params: { id: '3' }, body: { name: 'New' } }, res, next);
    await waitForAsyncHandler();

    expect(doc.name).toBe('New');

    deleteCategory({ params: { id: '3' } }, res, next);
    await waitForAsyncHandler();

    expect(doc.deleteOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenLastCalledWith({ message: 'Category removed' });
  });

  it('returns 404 when updating missing category', async () => {
    const res = createRes();
    const next = jest.fn();

    Category.findById.mockResolvedValue(null);
    mongoose.Types.ObjectId.isValid.mockReturnValue(true);

    updateCategory({ params: { id: '507f1f77bcf86cd799439011' }, body: { name: 'x' } }, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Category not found');
  });

  it('returns 404 when deleting missing category', async () => {
    const res = createRes();
    const next = jest.fn();

    Category.findById.mockResolvedValue(null);
    mongoose.Types.ObjectId.isValid.mockReturnValue(true);

    deleteCategory({ params: { id: '507f1f77bcf86cd799439011' } }, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Category not found');
  });
});
