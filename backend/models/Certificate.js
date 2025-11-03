const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, unique: true, required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  hash: { type: String, required: true, unique: true },
  previousHash: String,
  blockNumber: Number,
  
  pdfUrl: String,
  qrCodeUrl: String,
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issuedAt: { type: Date, default: Date.now },
  
  blockchainData: {
    blockNumber: Number,
    previousHash: String,
    timestamp: Date
  },
  
  verificationCount: { type: Number, default: 0 },
  lastVerifiedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);