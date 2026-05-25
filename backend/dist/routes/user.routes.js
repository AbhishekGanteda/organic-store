"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser, } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const router = express.Router();
router.use(protect, admin);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
module.exports = router;
//# sourceMappingURL=user.routes.js.map