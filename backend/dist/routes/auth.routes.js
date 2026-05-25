"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { registerUser, loginUser, getLoginPublicKey, getMe, updateProfile, } = require('../controllers/auth.controller');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();
router.post('/register', registerValidator, validateRequest, registerUser);
router.get('/login-public-key', getLoginPublicKey);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfileValidator, validateRequest, updateProfile);
module.exports = router;
//# sourceMappingURL=auth.routes.js.map