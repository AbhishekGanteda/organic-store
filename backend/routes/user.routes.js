const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', admin, getUsers);
router.route('/:id').get(admin, getUserById).put(admin, updateUser).delete(admin, deleteUser);

module.exports = router;
