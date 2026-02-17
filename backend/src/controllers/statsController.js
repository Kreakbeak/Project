const Report = require('../models/Report');
const PestDisease = require('../models/PestDisease');

// Get dashboard statistics for admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const identifiedReports = await Report.countDocuments({ status: 'Identified' });
    const resolvedReports = await Report.countDocuments({ status: 'Resolved' });

    // Get most common pests
    const mostCommonPests = await Report.aggregate([
      { $match: { referredPestId: { $ne: null } } },
      { $group: { _id: '$referredPestId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'pestdiseases', localField: '_id', foreignField: '_id', as: 'pest' } }
    ]);

    // Get reports by crop type
    const reportsByCrop = await Report.aggregate([
      { $group: { _id: '$cropType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent reports
    const recentReports = await Report.find()
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Resolution rate
    const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        identifiedReports,
        resolvedReports,
        resolutionRate: parseFloat(resolutionRate),
        mostCommonPests,
        reportsByCrop,
        recentReports
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard statistics for farmer
exports.getFarmerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(userId);

    const totalReports = await Report.countDocuments({ farmerId: userId });
    const pendingReports = await Report.countDocuments({ farmerId: userId, status: 'Pending' });
    const identifiedReports = await Report.countDocuments({ farmerId: userId, status: 'Identified' });
    const resolvedReports = await Report.countDocuments({ farmerId: userId, status: 'Resolved' });

    // Get reports by crop
    const reportsByCrop = await Report.aggregate([
      { $match: { farmerId: objectId } },
      { $group: { _id: '$cropType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent reports
    const recentReports = await Report.find({ farmerId: userId })
      .populate('referredPestId', 'name type')
      .sort({ createdAt: -1 })
      .limit(5);

    // Resolution rate
    const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        identifiedReports,
        resolvedReports,
        resolutionRate: parseFloat(resolutionRate),
        reportsByCrop,
        recentReports
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard statistics for agronomist (same as admin - see all reports)
exports.getAgronomistStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const identifiedReports = await Report.countDocuments({ status: 'Identified' });
    const reviewedReports = await Report.countDocuments({ status: 'Reviewed' });
    const resolvedReports = await Report.countDocuments({ status: 'Resolved' });

    // Get reports by crop type
    const reportsByCrop = await Report.aggregate([
      { $group: { _id: '$cropType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent reports
    const recentReports = await Report.find()
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Resolution rate
    const resolutionRate = totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        identifiedReports,
        reviewedReports,
        resolvedReports,
        resolutionRate: parseFloat(resolutionRate),
        reportsByCrop,
        recentReports
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
