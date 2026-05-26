import asyncHandler from '../middleware/async-handler';
import Feature from '../models/Feature';

const getAllFeatures = asyncHandler(async (req, res) => {
  const features = await Feature.find().sort({ id: 1 }).lean();
  res.json(features);
});

const getFeatureById = asyncHandler(async (req, res) => {
  const feature = await Feature.findOne({ id: Number(req.params.id) }).lean();
  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }
  res.json(feature);
});

const createFeature = asyncHandler(async (req, res) => {
  const existing = await Feature.findOne().sort({ id: -1 });
  const nextId = existing ? existing.id + 1 : 1;

  const feature = await Feature.create({
    id: nextId,
    name: req.body.name,
    icon: req.body.icon,
    description: req.body.description || '',
  });

  res.status(201).json(feature);
});

const updateFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findOne({ id: Number(req.params.id) });
  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  feature.name = req.body.name ?? feature.name;
  feature.icon = req.body.icon ?? feature.icon;
  feature.description = req.body.description ?? feature.description;

  const updated = await feature.save();
  res.json(updated);
});

const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findOne({ id: Number(req.params.id) });
  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  await feature.deleteOne();
  res.json({ message: 'Feature removed' });
});

export { getAllFeatures, getFeatureById, createFeature, updateFeature, deleteFeature };
