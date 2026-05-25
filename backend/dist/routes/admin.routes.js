"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getDashboardSummary } = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(protect, admin);
router.get('/summary', getDashboardSummary);
module.exports = router;
//# sourceMappingURL=admin.routes.js.map