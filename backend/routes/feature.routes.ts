const express = require('express');
const {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/feature.controller');
const { featureValidator } = require('../validators/feature.validator');
const validateRequest = require('../middleware/validate.middleware');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/').get(getAllFeatures).post(protect, admin, featureValidator, validateRequest, createFeature);
router.route('/:id').get(getFeatureById).put(protect, admin, featureValidator, validateRequest, updateFeature).delete(protect, admin, deleteFeature);

module.exports = router;
