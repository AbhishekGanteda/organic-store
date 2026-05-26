import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, } from '../controllers/category.controller';
import { categoryValidator } from '../validators/category.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect, admin } from '../middleware/auth.middleware';
const router = express.Router();
router.route('/').get(getAllCategories).post(protect, admin, categoryValidator, validateRequest, createCategory);
router.route('/:id').get(getCategoryById).put(protect, admin, categoryValidator, validateRequest, updateCategory).delete(protect, admin, deleteCategory);
export default router;
//# sourceMappingURL=category.routes.js.map