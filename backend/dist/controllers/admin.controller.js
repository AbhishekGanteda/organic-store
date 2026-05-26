import asyncHandler from '../middleware/async-handler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Feature from '../models/Feature.js';
import Question from '../models/Question.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
const getDashboardSummary = asyncHandler(async (req, res) => {
    const [totalUsers, totalProducts, totalCategories, totalFeatures, totalQuestions, totalReviews, totalOrders, ordersByStatus, totalRevenue,] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Feature.countDocuments(),
        Question.countDocuments(),
        Review.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]),
        Order.aggregate([
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$totalPrice' },
                },
            },
        ]),
    ]);
    res.json({
        totalUsers,
        totalProducts,
        totalCategories,
        totalFeatures,
        totalQuestions,
        totalReviews,
        totalOrders,
        totalRevenue: totalRevenue.length ? totalRevenue[0].revenue : 0,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}),
    });
});
export { getDashboardSummary };
//# sourceMappingURL=admin.controller.js.map