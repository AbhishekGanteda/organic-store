jest.mock('../models/Product', () => ({
    countDocuments: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
}));
const Product = require('../models/Product');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, } = require('../controllers/product.controller');
const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const waitForAsyncHandler = () => new Promise(resolve => {
    setImmediate(resolve);
});
describe('product.controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { query: {}, params: {}, body: {} };
        res = createRes();
        next = jest.fn();
        jest.clearAllMocks();
    });
    it('returns paginated product list', async () => {
        req.query = { page: '2', limit: '2', sort: 'price', sale: 'true' };
        const lean = jest.fn().mockResolvedValue([{ id: 3 }, { id: 4 }]);
        const limit = jest.fn().mockReturnValue({ lean });
        const skip = jest.fn().mockReturnValue({ limit });
        const sort = jest.fn().mockReturnValue({ skip });
        Product.countDocuments.mockResolvedValue(5);
        Product.find.mockReturnValue({ sort });
        getProducts(req, res, next);
        await waitForAsyncHandler();
        expect(Product.countDocuments).toHaveBeenCalledWith({ isSale: true });
        expect(sort).toHaveBeenCalledWith({ price: 1 });
        expect(skip).toHaveBeenCalledWith(2);
        expect(limit).toHaveBeenCalledWith(2);
        expect(res.json).toHaveBeenCalledWith({
            products: [{ id: 3 }, { id: 4 }],
            page: 2,
            totalPages: 3,
            total: 5,
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('returns 404 for missing product in getProductById', async () => {
        req.params.id = '99';
        Product.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null),
        });
        getProductById(req, res, next);
        await waitForAsyncHandler();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe('Product not found');
    });
    it('creates product with next numeric id', async () => {
        req.body = {
            name: 'New Product',
            category: 'Groceries',
            price: 100,
            originalPrice: 120,
            image: '/img.png',
            isSale: true,
            tags: ['new'],
            isTrending: false,
            isBestSeller: true,
        };
        Product.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue({ id: 12 }),
        });
        Product.create.mockResolvedValue({ id: 13, ...req.body });
        createProduct(req, res, next);
        await waitForAsyncHandler();
        expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({
            id: 13,
            name: 'New Product',
            price: 100,
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 13 }));
        expect(next).not.toHaveBeenCalled();
    });
    it('applies popularity sorting branch', async () => {
        req.query = { sort: 'popularity' };
        const lean = jest.fn().mockResolvedValue([]);
        const limit = jest.fn().mockReturnValue({ lean });
        const skip = jest.fn().mockReturnValue({ limit });
        const sort = jest.fn().mockReturnValue({ skip });
        Product.countDocuments.mockResolvedValue(0);
        Product.find.mockReturnValue({ sort });
        getProducts(req, res, next);
        await waitForAsyncHandler();
        expect(sort).toHaveBeenCalledWith({ rating: -1 });
    });
    it('applies default sorting branch', async () => {
        req.query = {};
        const lean = jest.fn().mockResolvedValue([]);
        const limit = jest.fn().mockReturnValue({ lean });
        const skip = jest.fn().mockReturnValue({ limit });
        const sort = jest.fn().mockReturnValue({ skip });
        Product.countDocuments.mockResolvedValue(0);
        Product.find.mockReturnValue({ sort });
        getProducts(req, res, next);
        await waitForAsyncHandler();
        expect(sort).toHaveBeenCalledWith({ id: 1 });
    });
    it('creates product starting id at 1 when collection is empty', async () => {
        req.body = {
            name: 'Fresh Product',
            category: 'Fruits',
            price: 50,
            image: '/img2.png',
        };
        Product.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue(null),
        });
        Product.create.mockResolvedValue({ id: 1, ...req.body });
        createProduct(req, res, next);
        await waitForAsyncHandler();
        expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });
    it('updates product and returns updated document', async () => {
        req.params.id = '10';
        req.body = { name: 'Updated', isTrending: true };
        const doc = {
            name: 'Old',
            category: 'C',
            price: 10,
            originalPrice: 12,
            image: 'x',
            rating: 3,
            description: 'd',
            isSale: false,
            tags: [],
            isTrending: false,
            isBestSeller: false,
            save: jest.fn().mockResolvedValue({ id: 10, name: 'Updated', isTrending: true }),
        };
        Product.findOne.mockResolvedValue(doc);
        updateProduct(req, res, next);
        await waitForAsyncHandler();
        expect(doc.name).toBe('Updated');
        expect(doc.isTrending).toBe(true);
        expect(res.json).toHaveBeenCalledWith({ id: 10, name: 'Updated', isTrending: true });
    });
    it('returns 404 when updating missing product', async () => {
        req.params.id = '500';
        req.body = { name: 'Updated' };
        Product.findOne.mockResolvedValue(null);
        updateProduct(req, res, next);
        await waitForAsyncHandler();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(next.mock.calls[0][0].message).toBe('Product not found');
    });
    it('deletes product when found', async () => {
        req.params.id = '10';
        const doc = { deleteOne: jest.fn().mockResolvedValue(undefined) };
        Product.findOne.mockResolvedValue(doc);
        deleteProduct(req, res, next);
        await waitForAsyncHandler();
        expect(doc.deleteOne).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'Product removed' });
    });
    it('returns 404 when deleting missing product', async () => {
        req.params.id = '10';
        Product.findOne.mockResolvedValue(null);
        deleteProduct(req, res, next);
        await waitForAsyncHandler();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(next.mock.calls[0][0].message).toBe('Product not found');
    });
});
//# sourceMappingURL=product.controller.test.js.map