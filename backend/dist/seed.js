import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';
import Product from './models/Product';
import Category from './models/Category';
import Feature from './models/Feature';
import Review from './models/Review';
import Question from './models/Question';
dotenv.config();
const dataDir = path.join(__dirname, '../frontend/src/app/core/data');
const productsData = require(path.join(dataDir, 'products.json'));
const categoriesData = require(path.join(dataDir, 'categories.json'));
const featuresData = require(path.join(dataDir, 'features.json'));
const reviewsData = require(path.join(dataDir, 'reviews.json'));
const questionsData = require(path.join(dataDir, 'questions.json'));
const seedDatabase = async () => {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Feature.deleteMany();
    await Review.deleteMany();
    await Question.deleteMany();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@organicstore.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
    await User.create({
        name: 'Admin',
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
    });
    await User.create({
        name: 'Demo User',
        email: 'user@organicstore.com',
        password: 'user1234',
        role: 'user',
    });
    await Product.insertMany(productsData);
    await Category.insertMany(categoriesData);
    await Feature.insertMany(featuresData);
    await Review.insertMany(reviewsData);
    await Question.insertMany(questionsData);
    console.log('Database seeded successfully');
    process.exit();
};
seedDatabase().catch(error => {
    console.error('Database seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map