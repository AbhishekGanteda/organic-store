import asyncHandler from '../middleware/async-handler';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
const getOrders = asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (req.user.role !== 'admin') {
        query.user = req.user._id;
    }
    if (status) {
        query.status = status;
    }
    if (search) {
        query['shippingAddress.city'] = { $regex: search, $options: 'i' };
    }
    const total = await Order.countDocuments(query);
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 20;
    const orders = await Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'id name price image')
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
    res.json({ orders, page: pageNumber, totalPages: Math.ceil(total / pageSize), total });
});
const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, totalPrice } = req.body;
    if (!items || !items.length) {
        res.status(400);
        throw new Error('Order items are required');
    }
    const orderItems = await Promise.all(items.map(async (item) => {
        const product = await Product.findOne({ id: Number(item.product) });
        if (!product) {
            throw new Error(`Product not found: ${item.product}`);
        }
        return {
            product: product._id,
            quantity: Number(item.quantity),
            price: product.price,
        };
    }));
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        totalPrice: Number(totalPrice),
    });
    await User.findByIdAndUpdate(req.user._id, {
        $set: { cart: [] },
    });
    const createdOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.product', 'id name price image')
        .lean();
    res.status(201).json(createdOrder);
});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    order.status = req.body.status || order.status;
    const updated = await order.save();
    res.json(updated);
});
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'id name price image')
        .lean();
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Access denied');
    }
    res.json(order);
});
export { getOrders, createOrder, updateOrderStatus, getOrderById };
//# sourceMappingURL=order.controller.js.map