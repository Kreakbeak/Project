const express = require('express');
const router = express.Router();
const { getAdminStats, getFarmerStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

// Admin stats
router.get('/admin', protect, authorize('admin'), getAdminStats);

// Farmer stats
router.get('/farmer', protect, authorize('farmer'), getFarmerStats);

module.exports = router;
