const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { categoryValidator } = require('../validators/category.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/').get(getAllCategories).post(protect, admin, categoryValidator, validateRequest, createCategory);
router.route('/:id').get(getCategoryById).put(protect, admin, categoryValidator, validateRequest, updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;
