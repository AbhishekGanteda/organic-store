jest.mock('../models/Order', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../models/Product', () => ({
  findOne: jest.fn(),
}));

jest.mock('../models/User', () => ({
  findByIdAndUpdate: jest.fn(),
}));

import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { getOrders,
  createOrder,
  updateOrderStatus,
  getOrderById, } from '../controllers/order.controller';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const waitForAsyncHandler = () => new Promise(resolve => {
  setImmediate(resolve);
});

describe('order.controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: { _id: 'u1', role: 'user' }, body: {}, params: {} };
    res = createRes();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('creates order and clears user cart', async () => {
    req.body = {
      items: [{ product: 101, quantity: 2 }],
      shippingAddress: { city: 'Hyd' },
      totalPrice: 400,
    };

    Product.findOne.mockResolvedValue({ _id: 'p1', price: 200 });
    Order.create.mockResolvedValue({ _id: 'o1' });

    const lean = jest.fn().mockResolvedValue({ _id: 'o1', items: [{ quantity: 2 }] });
    const secondPopulate = jest.fn().mockReturnValue({ lean });
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
    Order.findById.mockReturnValue({ populate: firstPopulate });

    createOrder(req, res, next);
    await waitForAsyncHandler();

    expect(Product.findOne).toHaveBeenCalledWith({ id: 101 });
    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
      user: 'u1',
      totalPrice: 400,
    }));
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', { $set: { cart: [] } });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: 'o1' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when creating order without items', async () => {
    req.body = {
      items: [],
      shippingAddress: { city: 'Hyd' },
      totalPrice: 100,
    };

    createOrder(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Order items are required');
  });

  it('returns 403 when non-admin accesses someone else order', async () => {
    req.params.id = 'o1';

    const foreignOrder = {
      _id: 'o1',
      user: { _id: 'u2' },
    };

    const lean = jest.fn().mockResolvedValue(foreignOrder);
    const secondPopulate = jest.fn().mockReturnValue({ lean });
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
    Order.findById.mockReturnValue({ populate: firstPopulate });

    getOrderById(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Access denied');
  });

  it('returns paginated orders for admin', async () => {
    req.user.role = 'admin';
    req.query = { page: '1', limit: '2', status: 'pending', search: 'hyd' };

    Order.countDocuments.mockResolvedValue(3);

    const lean = jest.fn().mockResolvedValue([{ _id: 'o1' }, { _id: 'o2' }]);
    const limit = jest.fn().mockReturnValue({ lean });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });
    const populate2 = jest.fn().mockReturnValue({ sort });
    const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
    Order.find.mockReturnValue({ populate: populate1 });

    getOrders(req, res, next);
    await waitForAsyncHandler();

    expect(Order.countDocuments).toHaveBeenCalledWith({
      status: 'pending',
      'shippingAddress.city': { $regex: 'hyd', $options: 'i' },
    });
    expect(res.json).toHaveBeenCalledWith({
      orders: [{ _id: 'o1' }, { _id: 'o2' }],
      page: 1,
      totalPages: 2,
      total: 3,
    });
  });

  it('filters orders by user for non-admin role', async () => {
    req.user = { _id: 'u1', role: 'user' };
    req.query = {};

    Order.countDocuments.mockResolvedValue(1);

    const lean = jest.fn().mockResolvedValue([{ _id: 'o1' }]);
    const limit = jest.fn().mockReturnValue({ lean });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });
    const populate2 = jest.fn().mockReturnValue({ sort });
    const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
    Order.find.mockReturnValue({ populate: populate1 });

    getOrders(req, res, next);
    await waitForAsyncHandler();

    expect(Order.countDocuments).toHaveBeenCalledWith({ user: 'u1' });
    expect(Order.find).toHaveBeenCalledWith({ user: 'u1' });
  });

  it('returns error when creating order with unknown product id', async () => {
    req.body = {
      items: [{ product: 999, quantity: 1 }],
      shippingAddress: { city: 'Hyd' },
      totalPrice: 100,
    };

    Product.findOne.mockResolvedValue(null);

    createOrder(req, res, next);
    await waitForAsyncHandler();

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Product not found: 999');
  });

  it('returns 404 when updateOrderStatus target is missing', async () => {
    req.params.id = 'missing';
    req.body = { status: 'shipped' };
    Order.findById.mockResolvedValue(null);

    updateOrderStatus(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Order not found');
  });

  it('updates order status successfully', async () => {
    req.params.id = 'o1';
    req.body = { status: 'delivered' };

    const orderDoc = {
      status: 'pending',
      save: jest.fn().mockResolvedValue({ _id: 'o1', status: 'delivered' }),
    };
    Order.findById.mockResolvedValue(orderDoc);

    updateOrderStatus(req, res, next);
    await waitForAsyncHandler();

    expect(orderDoc.status).toBe('delivered');
    expect(res.json).toHaveBeenCalledWith({ _id: 'o1', status: 'delivered' });
  });

  it('returns 404 for getOrderById when order does not exist', async () => {
    req.params.id = 'missing';

    const lean = jest.fn().mockResolvedValue(null);
    const secondPopulate = jest.fn().mockReturnValue({ lean });
    const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
    Order.findById.mockReturnValue({ populate: firstPopulate });

    getOrderById(req, res, next);
    await waitForAsyncHandler();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next.mock.calls[0][0].message).toBe('Order not found');
  });
});
