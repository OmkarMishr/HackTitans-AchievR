const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({

  // STUDENT
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  activityId: {
    type: String,
    sparse: true,
    index: true
  },

  // BASIC INFO 
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },

  category: {
    type: String,
    enum: ['Technical', 'Sports', 'Cultural', 'Volunteering', 'Internship', 'Academic', 'Leadership', 'Research', 'Other'],
    required: true,
    index: true
  },

  organizingBody: { type: String, trim: true, maxlength: 500 },
  achievementLevel: {
    type: String,
    enum: ['College', 'University', 'State', 'National', 'International'],
    default: 'College',
    index: true
  },

  eventDate: { type: Date, required: true, index: true },

  //  PROOF (optional)
  proofDocuments: [{
    filename: String,
    url: String,
    path: String,
    fileSize: Number,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // SKILLS
  selectedTechnicalSkills: { type: [String], default: [] },
  selectedSoftSkills: { type: [String], default: [] },
  selectedTools: { type: [String], default: [] },

  // STATUS
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

  //  CERTIFICATE
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

  // VERIFICATION
  verificationCode: { type: String, sparse: true, unique: true, index: true },
  verificationCount: { type: Number, default: 0 },

  verificationHistory: [{
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: { type: String, default: 'unknown' },
    ipAddress: String
  }],

  lastVerifiedAt: Date,

  // METADATA 
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

// SAFE ACTIVITY ID
activitySchema.pre('save', function (next) {
  if (!this.activityId) {
    const year = new Date().getFullYear();
    const unique = Date.now().toString().slice(-6);
    this.activityId = `ACT-${year}-${unique}`;
  }
  next();
});

//  INDEXES
activitySchema.index({ student: 1, createdAt: -1 });
activitySchema.index({ status: 1, createdAt: -1 });
activitySchema.index({ category: 1, achievementLevel: 1 });

// HELPER
function daysBetween(date) {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
}

// VIRTUALS
activitySchema.virtual('isCertified').get(function () {
  return !!this.certificateId;
});

activitySchema.virtual('daysSubmitted').get(function () {
  return daysBetween(this.submittedAt) || 0;
});

activitySchema.virtual('daysReviewed').get(function () {
  return daysBetween(this.reviewedAt);
});

activitySchema.virtual('daysCertified').get(function () {
  return daysBetween(this.certificateGeneratedAt);
});

activitySchema.virtual('certificateExpiryStatus').get(function () {
  if (!this.certificateExpiresAt) return 'N/A';
  const diff = daysBetween(this.certificateExpiresAt);
  return diff < 0 ? 'Expired' : `${Math.abs(diff)} days left`;
});

//  METHODS
activitySchema.methods.updateStatus = function (status, userId, note) {
  this.status = status;
  this.reviewedBy = userId;
  this.reviewedAt = new Date();

  if (status === 'approved') this.facultyComment = note;
  if (status === 'rejected') {
    this.rejectionReason = note;
    this.rejectedAt = new Date();
  }

  return this.save();
};

activitySchema.methods.updateCertificate = function (data) {
  Object.assign(this, {
    certificate: data.certificateId,
    certificateId: data.certificateId,
    certificatePath: data.certificatePath,
    certificateUrl: data.certificateUrl,
    qrCodePath: data.qrCodePath,
    qrCodeUrl: data.qrCodeUrl,
    certificateHash: data.certificateHash,
    certificateGeneratedAt: new Date(),
    status: 'certified'
  });
  return this.save();
};

activitySchema.methods.recordVerification = function (email, ip) {
  this.verificationHistory.push({
    verifiedBy: email,
    ipAddress: ip
  });
  this.verificationCount += 1;
  this.lastVerifiedAt = new Date();
  return this.save();
};

// GENERIC FINDERS 
activitySchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

activitySchema.statics.findByStudent = function (studentId) {
  return this.find({ student: studentId }).sort({ createdAt: -1 });
};

//  DASHBOARD STATS 
activitySchema.statics.getDashboardStats = function () {
  return this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        pending: [{ $match: { status: 'pending' } }, { $count: 'count' }],
        approved: [{ $match: { status: 'approved' } }, { $count: 'count' }],
        certified: [{ $match: { status: 'certified' } }, { $count: 'count' }],
        rejected: [{ $match: { status: 'rejected' } }, { $count: 'count' }]
      }
    }
  ]);
};

module.exports = mongoose.model('Activity', activitySchema);