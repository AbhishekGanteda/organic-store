import express from 'express';
import { getDashboardSummary } from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, admin);
router.get('/summary', getDashboardSummary);

export default router;
