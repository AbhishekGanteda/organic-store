import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, } from '../controllers/product.controller';
import { productValidator } from '../validators/product.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect, admin } from '../middleware/auth.middleware';
const router = express.Router();
router.route('/').get(getProducts).post(protect, admin, productValidator, validateRequest, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, productValidator, validateRequest, updateProduct).delete(protect, admin, deleteProduct);
export default router;
//# sourceMappingURL=product.routes.js.map