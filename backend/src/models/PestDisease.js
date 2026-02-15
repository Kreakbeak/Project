const mongoose = require('mongoose');

const pestDiseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Pest', 'Disease'],
    required: true
  },
  cropType: {
    type: String,
    enum: ['Tomato', 'Cucumber', 'Both'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  symptoms: {
    type: String,
    required: true,
    maxlength: 2000
  },
  treatment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  prevention: {
    type: String,
    maxlength: 2000
  },
  imagePath: {
    type: String,
    required: true
  },
  commonOccurrences: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

pestDiseaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PestDisease', pestDiseaseSchema);
