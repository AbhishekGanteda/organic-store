const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { productValidator } = require('../validators/product.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, productValidator, validateRequest, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, productValidator, validateRequest, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
