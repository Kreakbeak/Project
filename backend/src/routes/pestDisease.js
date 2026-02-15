const express = require('express');
const router = express.Router();
const {
  getAllPestsDiseases,
  getPestDiseasesByCrop,
  getPestDiseaseById,
  createPestDisease,
  updatePestDisease,
  deletePestDisease
} = require('../controllers/pestDiseaseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', getAllPestsDiseases);
router.get('/crop/:cropType', getPestDiseasesByCrop);
router.get('/:id', getPestDiseaseById);

// Admin only routes
router.post('/', protect, authorize('admin'), upload.single('image'), createPestDisease);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updatePestDisease);
router.delete('/:id', protect, authorize('admin'), deletePestDisease);

module.exports = router;
