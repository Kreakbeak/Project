const PestDisease = require('../models/PestDisease');

// Get all pests and diseases
exports.getAllPestsDiseases = async (req, res) => {
  try {
    const pests = await PestDisease.find().populate('createdBy', 'name');
    res.json({
      success: true,
      pests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get pests/diseases by crop type
exports.getPestDiseasesByCrop = async (req, res) => {
  try {
    const { cropType } = req.params;
    const pests = await PestDisease.find({
      $or: [
        { cropType: cropType },
        { cropType: 'Both' }
      ]
    }).populate('createdBy', 'name').sort({ commonOccurrences: -1 });
    
    res.json({
      success: true,
      pests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single pest/disease
exports.getPestDiseaseById = async (req, res) => {
  try {
    const pest = await PestDisease.findById(req.params.id).populate('createdBy', 'name');
    if (!pest) {
      return res.status(404).json({
        success: false,
        message: 'Pest/Disease not found'
      });
    }
    res.json({
      success: true,
      pest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create pest/disease (Admin only)
exports.createPestDisease = async (req, res) => {
  try {
    const { name, type, cropType, description, symptoms, treatment, prevention } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const pestDisease = new PestDisease({
      name,
      type,
      cropType,
      description,
      symptoms,
      treatment,
      prevention,
      imagePath: `/uploads/${req.file.filename}`,
      createdBy: req.user.id
    });

    await pestDisease.save();
    res.status(201).json({
      success: true,
      message: 'Pest/Disease created successfully',
      pest: pestDisease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update pest/disease (Admin only)
exports.updatePestDisease = async (req, res) => {
  try {
    const { name, type, cropType, description, symptoms, treatment, prevention } = req.body;
    let pestDisease = await PestDisease.findById(req.params.id);

    if (!pestDisease) {
      return res.status(404).json({
        success: false,
        message: 'Pest/Disease not found'
      });
    }

    pestDisease.name = name || pestDisease.name;
    pestDisease.type = type || pestDisease.type;
    pestDisease.cropType = cropType || pestDisease.cropType;
    pestDisease.description = description || pestDisease.description;
    pestDisease.symptoms = symptoms || pestDisease.symptoms;
    pestDisease.treatment = treatment || pestDisease.treatment;
    pestDisease.prevention = prevention || pestDisease.prevention;

    if (req.file) {
      pestDisease.imagePath = `/uploads/${req.file.filename}`;
    }

    await pestDisease.save();
    res.json({
      success: true,
      message: 'Pest/Disease updated successfully',
      pest: pestDisease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete pest/disease (Admin only)
exports.deletePestDisease = async (req, res) => {
  try {
    const pestDisease = await PestDisease.findByIdAndDelete(req.params.id);
    
    if (!pestDisease) {
      return res.status(404).json({
        success: false,
        message: 'Pest/Disease not found'
      });
    }

    res.json({
      success: true,
      message: 'Pest/Disease deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
