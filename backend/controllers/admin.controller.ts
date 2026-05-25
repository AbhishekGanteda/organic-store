const asyncHandler = require('../middleware/async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Feature = require('../models/Feature');
const Question = require('../models/Question');
const Review = require('../models/Review');
const Order = require('../models/Order');

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

module.exports = { getDashboardSummary };
