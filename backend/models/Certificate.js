const mongoose = require('mongoose');
const crypto = require('crypto');

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
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
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
  pdfPath: {
    type: String,
    required: true
  },
  
  qrCodeUrl: String,
  qrCodePath: String,

  
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
  
  isRevoked: {
    type: Boolean,
    default: false
  },
  
  revocationReason: String,
  revokedAt: Date,
  
  issuedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  
  verificationCount: { 
    type: Number, 
    default: 0
  },
  
  verificationHistory: [{
    _id: false,
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: { type: String, default: 'public' },
    ipAddress: String
  }],
  
  lastVerifiedAt: Date,
  
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  lastDownloadedAt: Date,
  lastViewedAt: Date,
  
  emailHistory: [{
    _id: false,
    sentAt: { type: Date, default: Date.now },
    email: String,
    messageId: String,
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    failureReason: String
  }],
  
  emailSentAt: Date,
  emailStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
    index: true
  },
  
  shareCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
  
}, { timestamps: true, collection: 'certificates' });

// ========== INDEXES ==========
certificateSchema.index({ student: 1, issuedAt: -1 });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ status: 1 });

// ========== VIRTUALS ==========
certificateSchema.virtual('isValid').get(function() {
  return this.status === 'active' && !this.isRevoked && (!this.expiresAt || this.expiresAt > new Date());
});

certificateSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiresAt) return null;
  return Math.ceil((this.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
});

// ========== METHODS ==========
certificateSchema.methods.recordEmailSent = function(email, messageId, status, failureReason = null) {
  if (!this.emailHistory) this.emailHistory = [];
  
  this.emailHistory.push({
    sentAt: new Date(),
    email,
    messageId,
    status,
    failureReason
  });
  
  this.emailSentAt = new Date();
  this.emailStatus = status;
  return this.save();
};

certificateSchema.methods.getEmailStats = function() {
  const total = this.emailHistory?.length || 0;
  const sent = this.emailHistory?.filter(h => h.status === 'sent').length || 0;
  const failed = this.emailHistory?.filter(h => h.status === 'failed').length || 0;
  
  return { total, sent, failed, lastAttempt: this.emailHistory?.[this.emailHistory.length - 1] };
};

certificateSchema.methods.recordVerification = function(email, ipAddress) {
  if (!this.verificationHistory) this.verificationHistory = [];
  
  this.verificationHistory.push({
    verifiedAt: new Date(),
    verifiedBy: email,
    ipAddress
  });
  
  this.verificationCount += 1;
  this.lastVerifiedAt = new Date();
  return this.save();
};

certificateSchema.methods.revoke = function(reason) {
  this.isRevoked = true;
  this.status = 'revoked';
  this.revocationReason = reason;
  this.revokedAt = new Date();
  return this.save();
};

// ========== STATICS ==========
certificateSchema.statics.findByStudent = function(studentId) {
  return this.find({ student: studentId }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findActive = function() {
  return this.find({ status: 'active', isRevoked: false });
};

module.exports = mongoose.model('Certificate', certificateSchema);
