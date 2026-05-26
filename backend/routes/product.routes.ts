import express from 'express';
import { getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct, } from '../controllers/product.controller.js';
import { productValidator } from '../validators/product.validator.js';
import validateRequest from '../middleware/validate.middleware.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, productValidator, validateRequest, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, productValidator, validateRequest, updateProduct).delete(protect, admin, deleteProduct);

export default router;
