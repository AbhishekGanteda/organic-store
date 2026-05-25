jest.mock('../models/User', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));
jest.mock('../utils/token', () => ({
    generateToken: jest.fn(),
}));
jest.mock('../utils/auth-crypto', () => ({
    getLoginPublicKey: jest.fn(),
    decryptLoginPassword: jest.fn(),
}));
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { getLoginPublicKey: loadLoginPublicKey, decryptLoginPassword } = require('../utils/auth-crypto');
const { loginUser, getLoginPublicKey, registerUser, getMe, updateProfile, } = require('../controllers/auth.controller');
const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const waitForAsyncHandler = () => new Promise(resolve => {
    setImmediate(resolve);
});
describe('auth.controller', () => {
    const next = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('loginUser', () => {
        it('logs in successfully with plaintext password', async () => {
            const req = {
                body: { email: 'Admin@Gmail.com', password: 'admin1234' },
            };
            const res = createRes();
            const mockUser = {
                _id: 'u1',
                name: 'Admin',
                email: 'admin@gmail.com',
                role: 'admin',
                matchPassword: jest.fn().mockResolvedValue(true),
            };
            User.findOne.mockResolvedValue(mockUser);
            generateToken.mockReturnValue('token-123');
            loginUser(req, res, next);
            await waitForAsyncHandler();
            expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@gmail.com' });
            expect(mockUser.matchPassword).toHaveBeenCalledWith('admin1234');
            expect(res.status).not.toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: 'u1',
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    role: 'admin',
                },
                token: 'token-123',
            });
            expect(next).not.toHaveBeenCalled();
        });
        it('decrypts encrypted password before matching', async () => {
            const req = {
                body: {
                    email: 'admin@gmail.com',
                    encryptedPassword: 'enc-value',
                },
            };
            const res = createRes();
            const mockUser = {
                _id: 'u1',
                name: 'Admin',
                email: 'admin@gmail.com',
                role: 'admin',
                matchPassword: jest.fn().mockResolvedValue(true),
            };
            decryptLoginPassword.mockReturnValue('decrypted-pass');
            User.findOne.mockResolvedValue(mockUser);
            generateToken.mockReturnValue('token-123');
            loginUser(req, res, next);
            await waitForAsyncHandler();
            expect(decryptLoginPassword).toHaveBeenCalledWith('enc-value');
            expect(mockUser.matchPassword).toHaveBeenCalledWith('decrypted-pass');
            expect(res.json).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
        it('returns 400 when encrypted payload is invalid', async () => {
            const req = {
                body: {
                    email: 'admin@gmail.com',
                    encryptedPassword: 'bad-value',
                },
            };
            const res = createRes();
            decryptLoginPassword.mockImplementation(() => {
                throw new Error('decrypt failed');
            });
            loginUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe('Invalid encrypted password payload');
        });
        it('returns 400 when password is missing', async () => {
            const req = {
                body: {
                    email: 'admin@gmail.com',
                },
            };
            const res = createRes();
            loginUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next.mock.calls[0][0].message).toBe('Password is required');
        });
        it('returns 401 for invalid credentials', async () => {
            const req = {
                body: { email: 'admin@gmail.com', password: 'wrong' },
            };
            const res = createRes();
            User.findOne.mockResolvedValue({
                _id: 'u1',
                matchPassword: jest.fn().mockResolvedValue(false),
            });
            loginUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(next.mock.calls[0][0].message).toBe('Invalid email or password');
        });
    });
    describe('getLoginPublicKey', () => {
        it('returns login public key payload', async () => {
            const req = {};
            const res = createRes();
            loadLoginPublicKey.mockReturnValue({
                publicKey: '-----BEGIN PUBLIC KEY-----abc-----END PUBLIC KEY-----',
                source: 'env',
            });
            getLoginPublicKey(req, res, next);
            await waitForAsyncHandler();
            expect(res.json).toHaveBeenCalledWith({
                publicKey: '-----BEGIN PUBLIC KEY-----abc-----END PUBLIC KEY-----',
                source: 'env',
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe('registerUser', () => {
        it('registers user successfully', async () => {
            const req = {
                body: { name: 'Admin', email: 'Admin@Gmail.com', password: 'admin1234' },
            };
            const res = createRes();
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                _id: 'u1',
                name: 'Admin',
                email: 'admin@gmail.com',
                role: 'admin',
            });
            generateToken.mockReturnValue('token-123');
            registerUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: 'u1',
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    role: 'admin',
                },
                token: 'token-123',
            });
        });
        it('returns 400 when user already exists', async () => {
            const req = {
                body: { name: 'Admin', email: 'admin@gmail.com', password: 'admin1234' },
            };
            const res = createRes();
            User.findOne.mockResolvedValue({ _id: 'existing-user' });
            registerUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe('User already exists');
        });
        it('returns 400 when user creation fails', async () => {
            const req = {
                body: { name: 'Admin', email: 'admin@gmail.com', password: 'admin1234' },
            };
            const res = createRes();
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(null);
            registerUser(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next.mock.calls[0][0].message).toBe('Invalid user data');
        });
    });
    describe('getMe', () => {
        it('returns profile of current user', async () => {
            const req = {
                user: {
                    _id: 'u1',
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    role: 'admin',
                    cart: [],
                    wishlist: [],
                    addresses: [],
                },
            };
            const res = createRes();
            getMe(req, res, next);
            await waitForAsyncHandler();
            expect(res.json).toHaveBeenCalledWith({
                id: 'u1',
                name: 'Admin',
                email: 'admin@gmail.com',
                role: 'admin',
                cart: [],
                wishlist: [],
                addresses: [],
            });
        });
    });
    describe('updateProfile', () => {
        it('updates profile and address data', async () => {
            const req = {
                user: {
                    _id: { toString: () => 'u1' },
                    name: 'Old',
                    email: 'old@gmail.com',
                    role: 'user',
                    addresses: [],
                    save: jest.fn().mockResolvedValue(undefined),
                },
                body: {
                    name: 'New',
                    email: 'new@gmail.com',
                    password: 'newpass123',
                    addresses: [{ city: 'Hyd' }],
                },
            };
            const res = createRes();
            User.findOne.mockResolvedValue(null);
            updateProfile(req, res, next);
            await waitForAsyncHandler();
            expect(req.user.name).toBe('New');
            expect(req.user.email).toBe('new@gmail.com');
            expect(req.user.password).toBe('newpass123');
            expect(req.user.addresses[0].city).toBe('Hyd');
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@gmail.com' }));
        });
        it('returns 400 when email belongs to another user', async () => {
            const req = {
                user: {
                    _id: { toString: () => 'u1' },
                    name: 'Old',
                    email: 'old@gmail.com',
                    role: 'user',
                    save: jest.fn().mockResolvedValue(undefined),
                },
                body: {
                    name: 'Old',
                    email: 'taken@gmail.com',
                },
            };
            const res = createRes();
            User.findOne.mockResolvedValue({ _id: { toString: () => 'u2' } });
            updateProfile(req, res, next);
            await waitForAsyncHandler();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(next.mock.calls[0][0].message).toBe('Email is already in use');
        });
        it('does not query for duplicate email when email is unchanged', async () => {
            const req = {
                user: {
                    _id: { toString: () => 'u1' },
                    name: 'User',
                    email: 'same@gmail.com',
                    role: 'user',
                    addresses: [],
                    save: jest.fn().mockResolvedValue(undefined),
                },
                body: {
                    name: 'User',
                    email: 'same@gmail.com',
                },
            };
            const res = createRes();
            updateProfile(req, res, next);
            await waitForAsyncHandler();
            expect(User.findOne).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'same@gmail.com' }));
        });
    });
});
//# sourceMappingURL=auth.controller.test.js.map