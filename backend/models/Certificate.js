const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
  
  certificateId: { 
    type: String, 
    required: true,
    index: true,
    unique: true
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
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  
  organizingBody: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
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
  
  // ✅ NO UNIQUE INDEX - JUST STORE
  certificateHash: { 
    type: String, 
    default: null        
  },
  
  verificationCode: {
    type: String,
    unique: true,
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
    default: false,
    index: true
  },
  
  revocationReason: {
    type: String,
    maxlength: 1000
  },
  
  revokedAt: Date,
  
  issuedAt: { 
    type: Date, 
    default: Date.now,
    required: true,
    index: true
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    index: true
  },
  
  verificationCount: { 
    type: Number, 
    default: 0
  },
  
  verificationHistory: [{
    _id: false,
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: { type: String, default: 'public' },
    ipAddress: String,
    userAgent: String,
    location: String
  }],
  
  lastVerifiedAt: Date,
  
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  lastDownloadedAt: Date,
  lastDownloadedBy: String,
  lastViewedAt: Date,
  lastViewedBy: String,
  
  emailHistory: [{
    _id: false,
    sentAt: { type: Date, default: Date.now },
    email: String,
    messageId: String,
    status: { type: String, enum: ['sent', 'failed', 'bounced'], default: 'sent' },
    failureReason: String,
    retryCount: { type: Number, default: 0 }
  }],
  
  emailSentAt: Date,
  emailStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'bounced'],
    default: 'pending',
    index: true
  },
  
  emailFailureReason: String,
  emailRetryCount: { type: Number, default: 0 },
  
  metadata: {
    browserInfo: String,
    deviceInfo: String,
    location: String,
    issuedFrom: String,
    ipAddress: String
  },
  
  shareCount: { type: Number, default: 0 },
  shareHistory: [{
    _id: false,
    sharedAt: { type: Date, default: Date.now },
    sharedOn: String,
    sharedBy: String
  }],
  
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
  
}, { 
  timestamps: true,
  collection: 'certificates',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========== INDEXES FOR PERFORMANCE ==========
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ status: 1, isRevoked: 1 });
certificateSchema.index({ activity: 1 });
certificateSchema.index({ verificationCode: 1 });
certificateSchema.index({ issuedAt: -1 });
certificateSchema.index({ emailStatus: 1 });
// ✅ THESE TWO ARE IMPORTANT FOR QUERIES
certificateSchema.index({ student: 1, issuedAt: -1 });
certificateSchema.index({ student: 1, status: 1 });

// ========== VIRTUAL FIELDS ==========
certificateSchema.virtual('isValid').get(function() {
  return this.status === 'active' && !this.isRevoked && (!this.expiresAt || this.expiresAt > new Date());
});

certificateSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const diff = this.expiresAt - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

certificateSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

certificateSchema.virtual('daysSinceIssued').get(function() {
  const now = new Date();
  const issued = new Date(this.issuedAt);
  return Math.floor((now - issued) / (1000 * 60 * 60 * 24));
});

certificateSchema.virtual('expiryStatus').get(function() {
  if (!this.isValid) return 'invalid';
  if (this.isExpired) return 'expired';
  if (this.daysUntilExpiry <= 30) return 'expiring_soon';
  return 'active';
});

certificateSchema.virtual('certificateAge').get(function() {
  const days = this.daysSinceIssued;
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// ========== INSTANCE METHODS ==========

certificateSchema.methods.revoke = function(reason) {
  this.isRevoked = true;
  this.status = 'revoked';
  this.revocationReason = reason || 'No reason provided';
  this.revokedAt = new Date();
  this.updatedAt = new Date();
  console.log(`🚫 Certificate revoked: ${this.certificateId}`);
  return this.save();
};

certificateSchema.methods.recordVerification = function(email, ipAddress, userAgent, location) {
  if (!this.verificationHistory) {
    this.verificationHistory = [];
  }
  
  this.verificationHistory.push({
    verifiedAt: new Date(),
    verifiedBy: email,
    ipAddress: ipAddress,
    userAgent: userAgent,
    location: location
  });
  
  this.verificationCount += 1;
  this.lastVerifiedAt = new Date();
  this.updatedAt = new Date();
  return this.save();
};

certificateSchema.methods.recordDownload = function(downloadedBy) {
  this.downloadCount += 1;
  this.lastDownloadedAt = new Date();
  this.lastDownloadedBy = downloadedBy || 'anonymous';
  this.updatedAt = new Date();
  return this.save();
};

certificateSchema.methods.recordView = function(viewedBy) {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  this.lastViewedBy = viewedBy || 'anonymous';
  this.updatedAt = new Date();
  return this.save();
};

certificateSchema.methods.recordShare = function(platform, sharedBy) {
  if (!this.shareHistory) {
    this.shareHistory = [];
  }
  
  this.shareHistory.push({
    sharedAt: new Date(),
    sharedOn: platform,
    sharedBy: sharedBy || 'anonymous'
  });
  
  this.shareCount += 1;
  this.updatedAt = new Date();
  return this.save();
};

certificateSchema.methods.recordEmailSent = function(email, messageId, status, failureReason = null) {
  if (!this.emailHistory) {
    this.emailHistory = [];
  }
  
  this.emailHistory.push({
    sentAt: new Date(),
    email: email,
    messageId: messageId,
    status: status,
    failureReason: failureReason,
    retryCount: 0
  });
  
  if (status === 'sent') {
    this.emailSentAt = new Date();
    this.emailStatus = 'sent';
    this.emailRetryCount = 0;
  } else {
    this.emailStatus = status;
    this.emailFailureReason = failureReason;
    this.emailRetryCount += 1;
  }
  
  this.updatedAt = new Date();
  return this.save();
};

certificateSchema.methods.getEmailStats = function() {
  const total = this.emailHistory?.length || 0;
  const sent = this.emailHistory?.filter(h => h.status === 'sent').length || 0;
  const failed = this.emailHistory?.filter(h => h.status === 'failed').length || 0;
  const bounced = this.emailHistory?.filter(h => h.status === 'bounced').length || 0;
  
  return {
    total,
    sent,
    failed,
    bounced,
    lastAttempt: this.emailHistory?.[this.emailHistory.length - 1] || null,
    emailSentAt: this.emailSentAt,
    status: this.emailStatus,
    canResend: !this.emailSentAt || (Date.now() - this.emailSentAt.getTime()) > 60 * 60 * 1000,
    retryCount: this.emailRetryCount,
    failureReason: this.emailFailureReason
  };
};

certificateSchema.methods.canResendEmail = function() {
  if (!this.emailSentAt) return true;
  const timeSinceLastSend = Date.now() - this.emailSentAt.getTime();
  return timeSinceLastSend > 60 * 60 * 1000;
};

certificateSchema.methods.getVerificationStats = function() {
  return {
    totalVerifications: this.verificationCount,
    lastVerifiedAt: this.lastVerifiedAt,
    verificationHistory: this.verificationHistory,
    averageVerificationsPerDay: this.daysSinceIssued > 0 ? (this.verificationCount / this.daysSinceIssued).toFixed(2) : 0,
    uniqueVerifiers: [...new Set(this.verificationHistory?.map(v => v.verifiedBy) || [])].length
  };
};

certificateSchema.methods.getDownloadStats = function() {
  return {
    totalDownloads: this.downloadCount,
    lastDownloadedAt: this.lastDownloadedAt,
    lastDownloadedBy: this.lastDownloadedBy,
    averageDownloadsPerDay: this.daysSinceIssued > 0 ? (this.downloadCount / this.daysSinceIssued).toFixed(2) : 0
  };
};

certificateSchema.methods.getShareStats = function() {
  const stats = {};
  this.shareHistory?.forEach(share => {
    stats[share.sharedOn] = (stats[share.sharedOn] || 0) + 1;
  });
  
  return {
    totalShares: this.shareCount,
    lastSharedAt: this.shareHistory?.[this.shareHistory.length - 1]?.sharedAt,
    shareBy: stats,
    shareHistory: this.shareHistory
  };
};

certificateSchema.methods.getAllStats = function() {
  return {
    certificateId: this.certificateId,
    status: this.status,
    isValid: this.isValid,
    isExpired: this.isExpired,
    expiryStatus: this.expiryStatus,
    certificateAge: this.certificateAge,
    daysUntilExpiry: this.daysUntilExpiry,
    daysSinceIssued: this.daysSinceIssued,
    downloads: this.getDownloadStats(),
    verifications: this.getVerificationStats(),
    shares: this.getShareStats(),
    views: {
      totalViews: this.viewCount,
      lastViewedAt: this.lastViewedAt,
      lastViewedBy: this.lastViewedBy
    },
    email: this.getEmailStats(),
    issuedDate: this.issuedAt,
    expiryDate: this.expiresAt,
    revokedAt: this.revokedAt
  };
};

certificateSchema.methods.generateQRData = function() {
  return {
    certificateId: this.certificateId,
    verificationUrl: `${process.env.APP_URL}/certificates/verify/${this.certificateId}`,
    hash: this.certificateHash,
    verificationCode: this.verificationCode
  };
};

// ========== STATIC METHODS ==========

certificateSchema.statics.findByCertificateId = function(certificateId) {
  return this.findOne({ certificateId })
    .populate('student', 'name email rollNumber')
    .populate('activity', 'title description')
    .populate('issuedBy', 'name email');
};

certificateSchema.statics.findByStudent = function(studentId) {
  return this.find({ student: studentId }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findByActivity = function(activityId) {
  return this.find({ activity: activityId }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active',
    isRevoked: false,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  });
};

certificateSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findRecentlyIssued = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return this.find({ issuedAt: { $gte: date } }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findMostVerified = function(limit = 10) {
  return this.find().sort({ verificationCount: -1 }).limit(limit);
};

certificateSchema.statics.findMostShared = function(limit = 10) {
  return this.find().sort({ shareCount: -1 }).limit(limit);
};

certificateSchema.statics.findUnsentCertificates = function() {
  return this.find({ 
    emailStatus: { $in: ['pending', 'failed'] },
    status: 'active'
  }).sort({ issuedAt: -1 });
};

certificateSchema.statics.findExpiringCertificates = function(daysThreshold = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysThreshold);
  
  return this.find({
    status: 'active',
    isRevoked: false,
    expiresAt: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).sort({ expiresAt: 1 });
};

certificateSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        active: [
          { $match: { status: 'active', isRevoked: false } },
          { $count: 'count' }
        ],
        revoked: [
          { $match: { isRevoked: true } },
          { $count: 'count' }
        ],
        expired: [
          { $match: { expiresAt: { $lt: new Date() } } },
          { $count: 'count' }
        ],
        emailStats: [
          {
            $group: {
              _id: '$emailStatus',
              count: { $sum: 1 }
            }
          }
        ],
        totalDownloads: [
          { $group: { _id: null, downloads: { $sum: '$downloadCount' } } }
        ],
        totalVerifications: [
          { $group: { _id: null, verifications: { $sum: '$verificationCount' } } }
        ],
        totalViews: [
          { $group: { _id: null, views: { $sum: '$viewCount' } } }
        ],
        totalShares: [
          { $group: { _id: null, shares: { $sum: '$shareCount' } } }
        ],
        byLevel: [
          {
            $group: {
              _id: '$achievementLevel',
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);
};

certificateSchema.statics.getDashboardStats = function() {
  return this.aggregate([
    {
      $facet: {
        totalCertificates: [{ $count: 'count' }],
        activeCertificates: [
          { $match: { status: 'active', isRevoked: false } },
          { $count: 'count' }
        ],
        pendingEmails: [
          { $match: { emailStatus: 'pending' } },
          { $count: 'count' }
        ],
        failedEmails: [
          { $match: { emailStatus: 'failed' } },
          { $count: 'count' }
        ],
        expiringCertificates: [
          {
            $match: {
              expiresAt: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            }
          },
          { $count: 'count' }
        ],
        recentlyIssued: [
          {
            $match: {
              issuedAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          },
          { $count: 'count' }
        ]
      }
    }
  ]);
};

// ========== MIDDLEWARE ==========

certificateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

certificateSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date() && this.status !== 'expired') {
    this.status = 'expired';
    console.log(`⏰ Certificate expired: ${this.certificateId}`);
  }
  next();
});

// ========== EXPORT ==========
module.exports = mongoose.model('Certificate', certificateSchema);
