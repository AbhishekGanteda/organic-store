import asyncHandler from '../middleware/async-handler';
import User from '../models/User';
import { generateToken } from '../utils/token';
import { getLoginPublicKey as loadLoginPublicKey, decryptLoginPassword, } from '../utils/auth-crypto';
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password,
    });
    if (user) {
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password, encryptedPassword } = req.body;
    let resolvedPassword = password;
    if (encryptedPassword) {
        try {
            resolvedPassword = decryptLoginPassword(encryptedPassword);
        }
        catch {
            res.status(400);
            throw new Error('Invalid encrypted password payload');
        }
    }
    if (!resolvedPassword) {
        res.status(400);
        throw new Error('Password is required');
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user && await user.matchPassword(resolvedPassword)) {
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
export const getLoginPublicKey = asyncHandler(async (req, res) => {
    const { publicKey, source } = loadLoginPublicKey();
    res.json({ publicKey, source });
});
export const getMe = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
        wishlist: user.wishlist,
        addresses: user.addresses,
    });
});
export const updateProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, email, password, addresses } = req.body;
    if (email && email.toLowerCase().trim() !== user.email) {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            res.status(400);
            throw new Error('Email is already in use');
        }
    }
    if (name) {
        user.name = name.trim();
    }
    if (email) {
        user.email = email.toLowerCase().trim();
    }
    if (password) {
        user.password = password;
    }
    if (addresses && Array.isArray(addresses)) {
        user.addresses = addresses.map(a => ({
            label: a.label || 'Home',
            street: a.street || '',
            city: a.city || '',
            state: a.state || '',
            postalCode: a.postalCode || '',
            country: a.country || '',
        }));
    }
    await user.save();
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
    });
});
// named exports already declared above
//# sourceMappingURL=auth.controller.js.map