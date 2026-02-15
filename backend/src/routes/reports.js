const express = require('express');
const router = express.Router();
const {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  referPestToReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// Specific routes first (these should be before :id routes)
router.get('/my-reports', protect, authorize('farmer'), getMyReports);
router.post('/refer-pest', protect, authorize('admin'), referPestToReport);

// ID-based routes (these should come after specific routes)
router.get('/:id', protect, getReportById);
router.put('/:id', protect, authorize('admin'), updateReportStatus);
router.delete('/:id', protect, authorize('farmer'), deleteReport);

// Generic routes (these should come last)
router.get('/', protect, authorize('admin'), getAllReports);
router.post('/', protect, authorize('farmer'), upload.single('image'), createReport);

module.exports = router;
