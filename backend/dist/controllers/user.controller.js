import asyncHandler from '../middleware/async-handler.js';
import User from '../models/User.js';
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    res.json(users);
});
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.json(user);
});
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ? req.body.email.toLowerCase().trim() : user.email;
    if (req.body.password) {
        user.password = req.body.password;
    }
    if (req.body.role) {
        user.role = req.body.role;
    }
    const updated = await user.save();
    res.json({
        _id: updated._id,
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        addresses: updated.addresses,
    });
});
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
});
export { getUsers, getUserById, updateUser, deleteUser };
//# sourceMappingURL=user.controller.js.map