import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, } from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.use(protect, admin);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
//# sourceMappingURL=user.routes.js.map