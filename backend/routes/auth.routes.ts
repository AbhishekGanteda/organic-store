import express from 'express';
import {
	registerUser,
	loginUser,
	getLoginPublicKey,
	getMe,
	updateProfile,
} from '../controllers/auth.controller.js';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/auth.validator.js';
import validateRequest from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.get('/login-public-key', getLoginPublicKey);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfileValidator, validateRequest, updateProfile);

export default router;
