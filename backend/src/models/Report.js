const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    enum: ['Tomato', 'Cucumber'],
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Identified', 'Resolved'],
    default: 'Pending'
  },
  treatment: {
    type: String,
    default: ''
  },
  referredPestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PestDisease',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
