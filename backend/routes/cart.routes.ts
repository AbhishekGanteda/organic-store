import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller';
import { cartValidator } from '../validators/cart.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', cartValidator, validateRequest, addToCart);
router.put('/:itemId', validateRequest, updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

export default router;
