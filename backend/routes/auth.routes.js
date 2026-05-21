const express = require('express');
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/auth.controller');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfileValidator, validateRequest, updateProfile);

module.exports = router;
