const mongoose = require('mongoose');
const warrantySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: String,
    default: ''
  },
  productName: {
    type: String,
    default: ''
  },
  purchaseDate: {
    type: Date
  },
  warrantyDuration: {
    type: String,
    default: ''
  },
  warrantyExpiryDate: {
    type: Date
  },
  serialNumber: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  extractedData: {
    type: Object,
    default: {}
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed','uploaded'],
    default: 'pending'
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('Warranty', warrantySchema);
