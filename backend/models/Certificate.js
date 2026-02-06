const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({

  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
    index: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: { type: String, required: true, trim: true },
  description: String,
  organizingBody: String,

  achievementLevel: {
    type: String,
    enum: ['College', 'University', 'State', 'National', 'International'],
    default: 'College',
    index: true
  },

  eventDate: Date,

  // FILES
  pdfUrl: String,
  pdfPath: { type: String, required: true },

  qrCodeUrl: String,
  qrCodePath: String,

  // VERIFICATION
  verificationCode: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ['active', 'revoked', 'expired', 'pending'],
    default: 'active',
    index: true
  },

  isRevoked: { type: Boolean, default: false },
  revocationReason: String,
  revokedAt: Date,

  issuedAt: { type: Date, default: Date.now, index: true },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },

  verificationCount: { type: Number, default: 0 },

  verificationHistory: [{
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: { type: String, default: 'public' },
    ipAddress: String
  }],

  lastVerifiedAt: Date,

  // USAGE TRACKING
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },

  lastDownloadedAt: Date,
  lastViewedAt: Date,

  shareCount: { type: Number, default: 0 }

}, {
  timestamps: true,
  collection: 'certificates'
});

//NDEXES 
certificateSchema.index({ student: 1, issuedAt: -1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ verificationCode: 1 });

// VIRTUALS
certificateSchema.virtual('isValid').get(function () {
  return (
    this.status === 'active' &&
    !this.isRevoked &&
    (!this.expiresAt || this.expiresAt > new Date())
  );
});

certificateSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiresAt) return null;
  return Math.ceil((this.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
});

//METHODS
certificateSchema.methods.recordVerification = function (email, ipAddress) {
  this.verificationHistory.push({
    verifiedBy: email,
    ipAddress
  });

  this.verificationCount += 1;
  this.lastVerifiedAt = new Date();
  return this.save();
};

certificateSchema.methods.revoke = function (reason) {
  this.isRevoked = true;
  this.status = 'revoked';
  this.revocationReason = reason;
  this.revokedAt = new Date();
  return this.save();
};

// STATICS
certificateSchema.statics.findByStudent = function (studentId) {
  return this.find({ student: studentId }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findActive = function () {
  return this.find({ status: 'active', isRevoked: false });
};
module.exports = mongoose.model('Certificate', certificateSchema);