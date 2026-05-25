jest.mock('../models/Feature', () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
}));
const Feature = require('../models/Feature');
const { getAllFeatures, getFeatureById, createFeature, updateFeature, deleteFeature, } = require('../controllers/feature.controller');
const createRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const waitForAsyncHandler = () => new Promise(resolve => {
    setImmediate(resolve);
});
describe('feature.controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('returns all features sorted by id', async () => {
        const req = {};
        const res = createRes();
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue([{ id: 1, name: 'f1' }]);
        const sort = jest.fn().mockReturnValue({ lean });
        Feature.find.mockReturnValue({ sort });
        getAllFeatures(req, res, next);
        await waitForAsyncHandler();
        expect(sort).toHaveBeenCalledWith({ id: 1 });
        expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'f1' }]);
    });
    it('returns 404 when feature does not exist', async () => {
        const req = { params: { id: '10' } };
        const res = createRes();
        const next = jest.fn();
        Feature.findOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null),
        });
        getFeatureById(req, res, next);
        await waitForAsyncHandler();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(next.mock.calls[0][0].message).toBe('Feature not found');
    });
    it('creates feature with incremented id', async () => {
        const req = { body: { name: 'Fast', icon: 'i', description: 'd' } };
        const res = createRes();
        const next = jest.fn();
        Feature.findOne.mockReturnValue({
            sort: jest.fn().mockResolvedValue({ id: 4 }),
        });
        Feature.create.mockResolvedValue({ id: 5, ...req.body });
        createFeature(req, res, next);
        await waitForAsyncHandler();
        expect(Feature.create).toHaveBeenCalledWith(expect.objectContaining({ id: 5 }));
        expect(res.status).toHaveBeenCalledWith(201);
    });
    it('updates existing feature', async () => {
        const req = { params: { id: '5' }, body: { name: 'New Name' } };
        const res = createRes();
        const next = jest.fn();
        const doc = {
            name: 'Old',
            icon: 'old-icon',
            description: 'old-desc',
            save: jest.fn().mockResolvedValue({ id: 5, name: 'New Name' }),
        };
        Feature.findOne.mockResolvedValue(doc);
        updateFeature(req, res, next);
        await waitForAsyncHandler();
        expect(doc.name).toBe('New Name');
        expect(res.json).toHaveBeenCalledWith({ id: 5, name: 'New Name' });
    });
    it('deletes feature and returns message', async () => {
        const req = { params: { id: '5' } };
        const res = createRes();
        const next = jest.fn();
        const doc = { deleteOne: jest.fn().mockResolvedValue(undefined) };
        Feature.findOne.mockResolvedValue(doc);
        deleteFeature(req, res, next);
        await waitForAsyncHandler();
        expect(doc.deleteOne).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'Feature removed' });
    });
});
//# sourceMappingURL=feature.controller.test.js.map