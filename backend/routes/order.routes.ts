import express from 'express';
import { getOrders,
  createOrder,
  updateOrderStatus,
  getOrderById, } from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { orderValidator } from '../validators/order.validator.js';
import validateRequest from '../middleware/validate.middleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getOrders).post(orderValidator, validateRequest, createOrder);
router.route('/:id').get(getOrderById).put(admin, updateOrderStatus);

export default router;
