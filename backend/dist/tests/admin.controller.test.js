jest.mock('../models/User', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Product', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Category', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Feature', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Question', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Review', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Order', () => ({
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
}));
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Feature = require('../models/Feature');
const Question = require('../models/Question');
const Review = require('../models/Review');
const Order = require('../models/Order');
const { getDashboardSummary } = require('../controllers/admin.controller');
const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const waitForAsyncHandler = () => new Promise(resolve => {
    setImmediate(resolve);
});
describe('admin.controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('returns dashboard summary aggregates', async () => {
        const req = {};
        const res = createRes();
        const next = jest.fn();
        User.countDocuments.mockResolvedValue(10);
        Product.countDocuments.mockResolvedValue(20);
        Category.countDocuments.mockResolvedValue(3);
        Feature.countDocuments.mockResolvedValue(4);
        Question.countDocuments.mockResolvedValue(5);
        Review.countDocuments.mockResolvedValue(6);
        Order.countDocuments.mockResolvedValue(7);
        Order.aggregate
            .mockResolvedValueOnce([
            { _id: 'pending', count: 2 },
            { _id: 'delivered', count: 5 },
        ])
            .mockResolvedValueOnce([{ _id: null, revenue: 900 }]);
        getDashboardSummary(req, res, next);
        await waitForAsyncHandler();
        expect(res.json).toHaveBeenCalledWith({
            totalUsers: 10,
            totalProducts: 20,
            totalCategories: 3,
            totalFeatures: 4,
            totalQuestions: 5,
            totalReviews: 6,
            totalOrders: 7,
            totalRevenue: 900,
            ordersByStatus: {
                pending: 2,
                delivered: 5,
            },
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('handles empty revenue aggregation result', async () => {
        const req = {};
        const res = createRes();
        const next = jest.fn();
        User.countDocuments.mockResolvedValue(1);
        Product.countDocuments.mockResolvedValue(2);
        Category.countDocuments.mockResolvedValue(3);
        Feature.countDocuments.mockResolvedValue(4);
        Question.countDocuments.mockResolvedValue(5);
        Review.countDocuments.mockResolvedValue(6);
        Order.countDocuments.mockResolvedValue(7);
        Order.aggregate
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        getDashboardSummary(req, res, next);
        await waitForAsyncHandler();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            totalRevenue: 0,
            ordersByStatus: {},
        }));
    });
});
//# sourceMappingURL=admin.controller.test.js.map