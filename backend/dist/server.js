"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const createAdminUser = require('./utils/createAdmin');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const featureRoutes = require('./routes/feature.routes');
const reviewRoutes = require('./routes/review.routes');
const questionRoutes = require('./routes/question.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const adminRoutes = require('./routes/admin.routes');
dotenv.config();
// Fail fast if critical environment variables are missing
const requiredEnvs = ['MONGODB_URI', 'JWT_SECRET'];
const missing = requiredEnvs.filter(k => !process.env[k]);
if (missing.length) {
    console.error('Missing required environment variables:', missing.join(', '));
    process.exit(1);
}
const PORT = process.env.PORT || 5000;
const app = express();
// Security headers
app.use(helmet());
// Simple rate limiter (tunable via env)
const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || 100, // limit each IP
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// CORS configuration: allow specific origins in production
const corsOptions = process.env.CORS_ORIGIN
    ? { origin: process.env.CORS_ORIGIN.split(','), credentials: true }
    : { origin: true };
app.use(cors(corsOptions));
// Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions));
// Body parsing
app.use(express.json());
// Prevent NoSQL injection by sanitizing request data
app.use(mongoSanitize());
app.use(morgan('dev'));
app.disable('etag');
// Prevent caching for API routes by default
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});
// Initialize DB and admin account
connectDB().then(createAdminUser).catch(err => {
    console.error('Unable to initialize database', err);
    process.exit(1);
});
app.get('/', (req, res) => {
    res.json({ message: 'Organic Store Backend is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map