import asyncHandler from '../middleware/async-handler';
import Category from '../models/Category';
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ id: 1 }).lean();
    res.json(categories);
});
const getCategoryById = asyncHandler(async (req, res) => {
    const param = req.params.id;
    let category;
    if (/^[0-9]+$/.test(param)) {
        category = await Category.findOne({ id: Number(param) }).lean();
    }
    else if (require('mongoose').Types.ObjectId.isValid(param)) {
        category = await Category.findById(param).lean();
    }
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.json(category);
});
const createCategory = asyncHandler(async (req, res) => {
    const existing = await Category.findOne().sort({ id: -1 });
    const nextId = existing ? existing.id + 1 : 1;
    const category = await Category.create({
        id: nextId,
        name: req.body.name,
        image: req.body.image,
        description: req.body.description || '',
    });
    res.status(201).json(category);
});
const updateCategory = asyncHandler(async (req, res) => {
    const param = req.params.id;
    let category;
    if (/^[0-9]+$/.test(param)) {
        category = await Category.findOne({ id: Number(param) });
    }
    else if (require('mongoose').Types.ObjectId.isValid(param)) {
        category = await Category.findById(param);
    }
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    category.name = req.body.name ?? category.name;
    category.image = req.body.image ?? category.image;
    category.description = req.body.description ?? category.description;
    const updated = await category.save();
    res.json(updated);
});
const deleteCategory = asyncHandler(async (req, res) => {
    const param = req.params.id;
    let category;
    if (/^[0-9]+$/.test(param)) {
        category = await Category.findOne({ id: Number(param) });
    }
    else if (require('mongoose').Types.ObjectId.isValid(param)) {
        category = await Category.findById(param);
    }
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    await category.deleteOne();
    res.json({ message: 'Category removed' });
});
export { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
//# sourceMappingURL=category.controller.js.map