import express from 'express';
import { getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature, } from '../controllers/feature.controller.js';
import { featureValidator } from '../validators/feature.validator.js';
import validateRequest from '../middleware/validate.middleware.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllFeatures).post(protect, admin, featureValidator, validateRequest, createFeature);
router.route('/:id').get(getFeatureById).put(protect, admin, featureValidator, validateRequest, updateFeature).delete(protect, admin, deleteFeature);

export default router;
