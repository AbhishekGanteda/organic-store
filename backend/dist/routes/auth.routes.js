import express from 'express';
import { registerUser, loginUser, getLoginPublicKey, getMe, updateProfile, } from '../controllers/auth.controller';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/auth.validator';
import validateRequest from '../middleware/validate.middleware';
import { protect } from '../middleware/auth.middleware';
const router = express.Router();
router.post('/register', registerValidator, validateRequest, registerUser);
router.get('/login-public-key', getLoginPublicKey);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfileValidator, validateRequest, updateProfile);
export default router;
//# sourceMappingURL=auth.routes.js.map