import asyncHandler from '../middleware/async-handler';
import Product from '../models/Product';
import User from '../models/User';

export const getCart = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id).populate('cart.product', 'id name price image').lean();

  res.json(user.cart || []);
});

export const addToCart = asyncHandler(async (req: any, res: any) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findOne({ id: Number(productId) });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cart.find((item: any) => item.product.toString() === product._id.toString());

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    user.cart.push({ product: product._id, quantity: Number(quantity) });
  }

  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product', 'id name price image').lean();
  res.status(201).json(updated.cart);
});

export const updateCartItem = asyncHandler(async (req: any, res: any) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }
  item.quantity = Number(quantity) || item.quantity;
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product', 'id name price image').lean();
  res.json(updated.cart);
});

export const removeCartItem = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);
  (user as any).cart = user.cart.filter((item: any) => item._id.toString() !== req.params.itemId);
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product', 'id name price image').lean();
  res.json(updated.cart);
});

export const clearCart = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);
  (user as any).cart = [];
  await user.save();
  res.json([]);
});
