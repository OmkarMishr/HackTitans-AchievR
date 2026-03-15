const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  // Core Relations
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Identifiers
  activityId: {
    type: String,
    sparse: true,
    index: true
  },

  // Activity Details
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },

  category: {
    type: String,
    enum: ['Technical', 'Sports', 'Cultural', 'Volunteering', 'Internship',
      'Academic', 'Leadership', 'Research', 'Other'],
    required: true,
    index: true
  },

  organizingBody: { type: String, trim: true, maxlength: 500 },
  achievementLevel: {
    type: String,
    enum: ['College', 'University', 'State', 'National', 'International'],
    default: 'College'
  },

  eventDate: { type: Date, required: true, index: true },

  // Proof Documents
  proofDocuments: [{
    filename: String,
    url: String,
    path: String,
    fileSize: Number,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Skills & Tools
  selectedTechnicalSkills: { type: [String], default: [] },
  selectedSoftSkills: { type: [String], default: [] },
  selectedTools: { type: [String], default: [] },

  // Workflow Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged', 'certified'],
    default: 'pending',
    index: true
  },

  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  facultyComment: { type: String, maxlength: 2000 },
  reviewedAt: Date,

  submittedAt: { type: Date, default: Date.now, index: true },

  rejectionReason: { type: String, maxlength: 2000 },
  rejectedAt: Date,

  // Certificate Integration
  certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  certificateId: { type: String, sparse: true, unique: true, index: true },
  certificatePath: String,
  certificateUrl: String,
  qrCodePath: String,
  qrCodeUrl: String,
  certificateHash: { type: String, sparse: true, unique: true, index: true },
  certificateGeneratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certificateGeneratedAt: { type: Date, index: true },
  certificateExpiresAt: Date,

  // Verification Tracking
  verificationCode: { type: String, sparse: true, unique: true, index: true },
  verificationCount: { type: Number, default: 0 },
  verificationHistory: [{
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: String,
    ipAddress: String
  }],
  lastVerifiedAt: Date,

  // Audit Trail
  metadata: {
    ipAddress: String,
    userAgent: String,
    submissionDeviceInfo: String,
    location: String
  }

}, {
  timestamps: true,
  collection: 'activities'
});

// Auto-generate activityId
activitySchema.pre('save', function (next) {
  if (!this.activityId) {
    const year = new Date().getFullYear();
    const seq = Date.now().toString().slice(-6);
    this.activityId = `ACT-${year}-${seq}`;
  }
  next();
});

// Optimized Indexes
activitySchema.index({ student: 1, createdAt: -1 });
activitySchema.index({ status: 1, createdAt: -1 });
activitySchema.index({ category: 1, achievementLevel: 1 });
activitySchema.index({ certificateId: 1 });

// Virtual Properties
const daysSince = (date) => date ? Math.floor((Date.now() - new Date(date)) / 86400000) : null;

activitySchema.virtual('isCertified').get(function () {
  return !!this.certificateId;
});

activitySchema.virtual('daysSubmitted').get(function () {
  return daysSince(this.submittedAt);
});

activitySchema.virtual('daysReviewed').get(function () {
  return daysSince(this.reviewedAt);
});

activitySchema.virtual('daysCertified').get(function () {
  return daysSince(this.certificateGeneratedAt);
});

activitySchema.virtual('certificateExpiryStatus').get(function () {
  if (!this.certificateExpiresAt) return 'Permanent';
  const days = daysSince(this.certificateExpiresAt);
  return days < 0 ? 'Expired' : `${days} days remaining`;
});

// Instance Methods
activitySchema.methods.updateStatus = async function (status, reviewerId, note = '') {
  this.status = status;
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();

  if (status === 'approved') {
    this.facultyComment = note;
  } else if (status === 'rejected') {
    this.rejectionReason = note;
    this.rejectedAt = new Date();
  }

  return this.save();
};

activitySchema.methods.linkCertificate = async function (certData) {
  Object.assign(this, {
    certificate: certData._id,
    certificateId: certData.certificateId,
    certificatePath: certData.pdfPath,
    certificateUrl: certData.pdfUrl,
    qrCodePath: certData.qrCodePath,
    qrCodeUrl: certData.qrCodeUrl,
    certificateHash: certData.certificateHash,
    certificateGeneratedBy: certData.issuedBy,
    certificateGeneratedAt: new Date(),
    status: 'certified'
  });
  return this.save();
};

activitySchema.methods.recordVerification = async function (verifiedBy, ip) {
  this.verificationHistory.push({
    verifiedBy,
    ipAddress: ip,
    verifiedAt: new Date()
  });
  this.verificationCount += 1;
  this.lastVerifiedAt = new Date();
  return this.save();
};

// Static Queries
activitySchema.statics.pendingForFaculty = function () {
  return this.find({ status: 'pending' })
    .populate('student', 'name rollNumber department email')
    .sort({ submittedAt: -1 });
};

activitySchema.statics.byStudent = function (studentId) {
  return this.find({ student: studentId })
    .populate('reviewedBy', 'name')
    .populate('certificate', 'certificateId')
    .sort({ submittedAt: -1 });
};

activitySchema.statics.dashboardStats = function () {
  return this.aggregate([{
    $facet: {
      total: [{ $count: 'count' }],
      pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
      approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
      certified: [{ $match: { status: 'certified' } }, { $count: 'count' }],
      rejected: [{ $match: { status: 'rejected' } }, { $count: 'count' }]
    }
  }]);
};

module.exports = mongoose.model('Activity', activitySchema);