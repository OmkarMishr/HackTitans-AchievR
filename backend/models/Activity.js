const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityId: { type: String, unique: true },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Sports', 'Cultural', 'Volunteering', 'Internship', 'Academic', 'Leadership', 'Research', 'Other'],
    required: true
  },
  
  organizingBody: String,
  achievementLevel: {
    type: String,
    enum: ['College', 'University', 'State', 'National', 'International']
  },
  eventDate: { type: Date, required: true },
  
  proofDocuments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Manual Skills Selection
  selectedTechnicalSkills: [String],
  selectedSoftSkills: [String],
  selectedTools: [String],
  
  // Fraud Detection
  fraudDetectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'FraudDetection' },
  fraudStatus: {
    type: String,
    enum: ['not_scanned', 'flagged', 'approved_by_ai', 'manual_override'],
    default: 'not_scanned'
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'certified', 'rejected'],
    default: 'pending'
  },
  
  submittedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  facultyComment: String,
  reviewedAt: Date,
  
  certifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certificateHash: String,
  certificateUrl: String,
  qrCodeUrl: String,
  blockchainData: {
    blockNumber: Number,
    previousHash: String,
    timestamp: Date
  },
  certifiedAt: Date,
  
  rejectionReason: String
  
}, { timestamps: true });

activitySchema.pre('save', async function(next) {
  if (!this.activityId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.activityId = `ACT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
