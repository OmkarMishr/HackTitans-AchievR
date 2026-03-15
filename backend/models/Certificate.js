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


  pdfUrl: String,
  pdfPath: { type: String, required: true },

  qrCodeUrl: String,
  qrCodePath: String,

  status: {
    type: String,
    enum: ['active', 'revoked'],
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

}, {
  timestamps: true,
  collection: 'certificates'
});


certificateSchema.index({ certificateId: 1 }, { unique: true });
certificateSchema.index({ student: 1, issuedAt: -1 });
certificateSchema.index({ status: 1 });


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
certificateSchema.methods.revoke = function (reason) {
  this.isRevoked = true;
  this.status = 'revoked';
  this.revocationReason = reason;
  this.revokedAt = new Date();
  return this.save();
};

// STATs
certificateSchema.statics.findByStudent = function (studentId) {
  return this.find({ student: studentId }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findActive = function () {
  return this.find({ status: 'active', isRevoked: false });
};
module.exports = mongoose.model('Certificate', certificateSchema);