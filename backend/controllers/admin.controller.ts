import asyncHandler from '../middleware/async-handler';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import Feature from '../models/Feature';
import Question from '../models/Question';
import Review from '../models/Review';
import Order from '../models/Order';

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalCategories,
    totalFeatures,
    totalQuestions,
    totalReviews,
    totalOrders,
    ordersByStatus,
    totalRevenue,
  ] = await Promise.all([
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
