jest.mock('../models/User', () => ({
    find: jest.fn(),
    findById: jest.fn(),
}));
const User = require('../models/User');
const { getUsers, getUserById, updateUser, deleteUser, } = require('../controllers/user.controller');
const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const waitForAsyncHandler = () => new Promise(resolve => {
    setImmediate(resolve);
});
describe('user.controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('returns users list without password', async () => {
        const req = {};
        const res = createRes();
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue([{ _id: 'u1', name: 'Admin' }]);
        const select = jest.fn().mockReturnValue({ lean });
        User.find.mockReturnValue({ select });
        getUsers(req, res, next);
        await waitForAsyncHandler();
        expect(select).toHaveBeenCalledWith('-password');
        expect(res.json).toHaveBeenCalledWith([{ _id: 'u1', name: 'Admin' }]);
    });
    it('returns 404 when getUserById misses', async () => {
        const req = { params: { id: 'u1' } };
        const res = createRes();
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(null);
        const select = jest.fn().mockReturnValue({ lean });
        User.findById.mockReturnValue({ select });
        getUserById(req, res, next);
        await waitForAsyncHandler();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    it('updates user fields and returns DTO payload', async () => {
        const req = {
            params: { id: 'u1' },
            body: { name: 'New Name', email: 'NEW@MAIL.COM', role: 'admin' },
        };
        const res = createRes();
        const next = jest.fn();
        const saved = {
            _id: 'u1',
            name: 'New Name',
            email: 'new@mail.com',
            role: 'admin',
            addresses: [],
        };
        const userDoc = {
            name: 'Old',
            email: 'old@mail.com',
            role: 'user',
            save: jest.fn().mockResolvedValue(saved),
        };
        User.findById.mockResolvedValue(userDoc);
        updateUser(req, res, next);
        await waitForAsyncHandler();
        expect(userDoc.email).toBe('new@mail.com');
        expect(res.json).toHaveBeenCalledWith({
            _id: 'u1',
            id: 'u1',
            name: 'New Name',
            email: 'new@mail.com',
            role: 'admin',
            addresses: [],
        });
    });
    it('deletes user and returns message', async () => {
        const req = { params: { id: 'u1' } };
        const res = createRes();
        const next = jest.fn();
        const userDoc = {
            deleteOne: jest.fn().mockResolvedValue(undefined),
        };
        User.findById.mockResolvedValue(userDoc);
        deleteUser(req, res, next);
        await waitForAsyncHandler();
        expect(userDoc.deleteOne).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'User removed' });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=user.controller.test.js.map