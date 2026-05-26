import asyncHandler from '../middleware/async-handler.js';
import Product from '../models/Product.js';
const getProducts = asyncHandler(async (req, res) => {
    const { category, search, sort, page = 1, limit = 12, sale, trending, bestSeller, } = req.query;
    const query = {};
    if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    if (sale === 'true') {
        query.isSale = true;
    }
    if (trending === 'true') {
        query.isTrending = true;
    }
    if (bestSeller === 'true') {
        query.isBestSeller = true;
    }
    const total = await Product.countDocuments(query);
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    let mongoQuery = Product.find(query);
    if (sort === 'price') {
        mongoQuery = mongoQuery.sort({ price: 1 });
    }
    else if (sort === 'popularity') {
        mongoQuery = mongoQuery.sort({ rating: -1 });
    }
    else {
        mongoQuery = mongoQuery.sort({ id: 1 });
    }
    const products = await mongoQuery
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
    res.json({
        products,
        page: pageNumber,
        totalPages: Math.ceil(total / pageSize),
        total,
    });
});
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ id: Number(id) }).lean();
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json(product);
});
const createProduct = asyncHandler(async (req, res) => {
    const existing = await Product.findOne().sort({ id: -1 });
    const nextId = existing ? existing.id + 1 : 1;
    const product = await Product.create({
        id: nextId,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
        image: req.body.image,
        rating: req.body.rating || 0,
        description: req.body.description || '',
        isSale: !!req.body.isSale,
        tags: req.body.tags || [],
        isTrending: !!req.body.isTrending,
        isBestSeller: !!req.body.isBestSeller,
    });
    res.status(201).json(product);
});
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    Object.assign(product, {
        name: req.body.name ?? product.name,
        category: req.body.category ?? product.category,
        price: req.body.price ?? product.price,
        originalPrice: req.body.originalPrice ?? product.originalPrice,
        image: req.body.image ?? product.image,
        rating: req.body.rating ?? product.rating,
        description: req.body.description ?? product.description,
        isSale: req.body.isSale ?? product.isSale,
        tags: req.body.tags ?? product.tags,
        isTrending: req.body.isTrending ?? product.isTrending,
        isBestSeller: req.body.isBestSeller ?? product.isBestSeller,
    });
    const updated = await product.save();
    res.json(updated);
});
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
});
export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
//# sourceMappingURL=product.controller.js.map