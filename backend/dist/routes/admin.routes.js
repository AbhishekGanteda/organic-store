import express from 'express';
import { getDashboardSummary } from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';
const router = express.Router();
router.use(protect, admin);
router.get('/summary', getDashboardSummary);
export default router;
//# sourceMappingURL=admin.routes.js.map