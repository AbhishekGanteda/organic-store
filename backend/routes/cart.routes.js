const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');
const { cartValidator } = require('../validators/cart.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', cartValidator, validateRequest, addToCart);
router.put('/:itemId', validateRequest, updateCartItem);
router.delete('/:itemId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
