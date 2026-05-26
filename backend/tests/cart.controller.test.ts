jest.mock('../models/Product', () => ({
  findOne: jest.fn(),
}));

jest.mock('../models/User', () => ({
  findById: jest.fn(),
}));

import Product from '../models/Product.js';
import User from '../models/User.js';
import { getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart, } from '../controllers/cart.controller.js';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const waitForAsyncHandler = () => new Promise(resolve => {
  setImmediate(resolve);
});

describe('cart.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns populated cart for current user', async () => {
    const req = { user: { _id: 'u1' } };
    const res = createRes();
    const next = jest.fn();

    const lean = jest.fn().mockResolvedValue({ cart: [{ quantity: 1 }] });
    const populate = jest.fn().mockReturnValue({ lean });
    User.findById.mockReturnValue({ populate });

    getCart(req, res, next);
    await waitForAsyncHandler();

    expect(populate).toHaveBeenCalledWith('cart.product', 'id name price image');
    expect(res.json).toHaveBeenCalledWith([{ quantity: 1 }]);
  });

  it('adds a new cart item and returns updated cart', async () => {
    const req = { user: { _id: 'u1' }, body: { productId: 101, quantity: 2 } };
    const res = createRes();
    const next = jest.fn();

    Product.findOne.mockResolvedValue({ _id: 'p1', id: 101 });

    const userDoc = {
      cart: [],
      save: jest.fn().mockResolvedValue(undefined),
    };

    const lean = jest.fn().mockResolvedValue({ cart: [{ quantity: 2 }] });
    const populate = jest.fn().mockReturnValue({ lean });

    User.findById
      .mockResolvedValueOnce(userDoc)
      .mockReturnValueOnce({ populate });

    addToCart(req, res, next);
    await waitForAsyncHandler();

    expect(userDoc.cart).toHaveLength(1);
    expect(userDoc.cart[0]).toEqual({ product: 'p1', quantity: 2 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([{ quantity: 2 }]);
  });

  it('returns 404 when adding missing product', async () => {
    const req = { user: { _id: 'u1' }, body: { productId: 999, quantity: 1 } };
    const res = createRes();
    const next = jest.fn();

    Product.findOne.mockResolvedValue(null);

    addToCart(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('increments quantity when product already exists in cart', async () => {
    const req = { user: { _id: 'u1' }, body: { productId: 101, quantity: 3 } };
    const res = createRes();
    const next = jest.fn();

    Product.findOne.mockResolvedValue({ _id: 'p1', id: 101 });

    const existingItem = {
      product: { toString: () => 'p1' },
      quantity: 2,
    };

    const userDoc = {
      cart: [existingItem],
      save: jest.fn().mockResolvedValue(undefined),
    };

    const lean = jest.fn().mockResolvedValue({ cart: [{ quantity: 5 }] });
    const populate = jest.fn().mockReturnValue({ lean });

    User.findById
      .mockResolvedValueOnce(userDoc)
      .mockReturnValueOnce({ populate });

    addToCart(req, res, next);
    await waitForAsyncHandler();

    expect(existingItem.quantity).toBe(5);
    expect(res.json).toHaveBeenCalledWith([{ quantity: 5 }]);
  });

  it('updates quantity for existing cart item', async () => {
    const req = { user: { _id: 'u1' }, params: { itemId: 'i1' }, body: { quantity: 5 } };
    const res = createRes();
    const next = jest.fn();

    const item = { quantity: 1 };
    const userDoc = {
      cart: { id: jest.fn().mockReturnValue(item) },
      save: jest.fn().mockResolvedValue(undefined),
    };

    const lean = jest.fn().mockResolvedValue({ cart: [{ quantity: 5 }] });
    const populate = jest.fn().mockReturnValue({ lean });

    User.findById
      .mockResolvedValueOnce(userDoc)
      .mockReturnValueOnce({ populate });

    updateCartItem(req, res, next);
    await waitForAsyncHandler();

    expect(item.quantity).toBe(5);
    expect(res.json).toHaveBeenCalledWith([{ quantity: 5 }]);
  });

  it('returns 404 when updating a missing cart item', async () => {
    const req = { user: { _id: 'u1' }, params: { itemId: 'missing' }, body: { quantity: 5 } };
    const res = createRes();
    const next = jest.fn();

    const userDoc = {
      cart: { id: jest.fn().mockReturnValue(null) },
      save: jest.fn().mockResolvedValue(undefined),
    };

    User.findById.mockResolvedValue(userDoc);

    updateCartItem(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Cart item not found');
  });

  it('removes cart item by id', async () => {
    const req = { user: { _id: 'u1' }, params: { itemId: 'i1' } };
    const res = createRes();
    const next = jest.fn();

    const userDoc = {
      cart: [
        { _id: { toString: () => 'i1' } },
        { _id: { toString: () => 'i2' } },
      ],
      save: jest.fn().mockResolvedValue(undefined),
    };

    const lean = jest.fn().mockResolvedValue({ cart: [{ _id: 'i2' }] });
    const populate = jest.fn().mockReturnValue({ lean });

    User.findById
      .mockResolvedValueOnce(userDoc)
      .mockReturnValueOnce({ populate });

    removeCartItem(req, res, next);
    await waitForAsyncHandler();

    expect(userDoc.cart).toHaveLength(1);
    expect(res.json).toHaveBeenCalledWith([{ _id: 'i2' }]);
  });

  it('clears cart for user', async () => {
    const req = { user: { _id: 'u1' } };
    const res = createRes();
    const next = jest.fn();

    const userDoc = {
      cart: [{ _id: 'i1' }],
      save: jest.fn().mockResolvedValue(undefined),
    };

    User.findById.mockResolvedValue(userDoc);

    clearCart(req, res, next);
    await waitForAsyncHandler();

    expect(userDoc.cart).toEqual([]);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
