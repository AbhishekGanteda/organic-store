"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getOrders, createOrder, updateOrderStatus, getOrderById, } = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { orderValidator } = require('../validators/order.validator');
const validateRequest = require('../middleware/validate.middleware');
const router = express.Router();
router.use(protect);
router.route('/').get(getOrders).post(orderValidator, validateRequest, createOrder);
router.route('/:id').get(getOrderById).put(admin, updateOrderStatus);
module.exports = router;
//# sourceMappingURL=order.routes.js.map