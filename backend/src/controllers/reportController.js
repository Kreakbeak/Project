const Report = require('../models/Report');
const path = require('path');

exports.createReport = async (req, res) => {
  try {
    const { cropType, description, location } = req.body;

    if (!cropType || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const report = await Report.create({
      farmerId: req.user.id,
      cropType,
      imagePath: `/uploads/${req.file.filename}`,
      description,
      location,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ farmerId: req.user.id })
      .populate('referredPestId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('farmerId', 'name email phone location')
      .populate('referredPestId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('farmerId', 'name email phone location')
      .populate('referredPestId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check authorization: allow if admin, agronomist, or if farmer viewing own report
    if (req.user.role === 'farmer' && report.farmerId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
    }
    if (req.user.role === 'officer' && report.farmerId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { status, treatment, feedback } = req.body;

    if (!status || !['Pending', 'Identified', 'Reviewed', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Identified, Reviewed, or Resolved'
      });
    }

    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = status;
    if (treatment) {
      report.treatment = treatment;
    }
    if (feedback) {
      report.feedback = feedback;
    }

    report = await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.referPestToReport = async (req, res) => {
  try {
    const { reportId, pestId } = req.body;

    if (!reportId || !pestId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide report ID and pest ID'
      });
    }

    // Handle "not_in_library" option
    const pestToSet = pestId === 'not_in_library' ? null : pestId;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { referredPestId: pestToSet },
      { new: true }
    ).populate('farmerId').populate('referredPestId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: pestToSet ? 'Pest reference added to report successfully' : 'Report marked as not in library',
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};