const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const certificateService = require('../services/certificateService');

// Generate certificate for approved activity (admin/faculty)
exports.generateCertificate = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId)
      .populate('student', 'name email rollNumber department');

    if (!activity || activity.status !== 'approved') {
      return res.status(404).json({ error: 'Approved activity not found' });
    }

    // Simple unique ID
    const certificateId = `CERT_${Date.now()}`;
    const verificationCode = crypto.randomBytes(10).toString('hex');

    // Generate PDF via service
    const result = await certificateService.generateCertificate({
      studentName: activity.student.name,
      achievement: activity.title,
      organizingBody: activity.organizingBody,
      eventDate: activity.eventDate,
      achievementLevel: activity.achievementLevel,
      certificateId,
      rollNo: activity.student.rollNumber,
      department: activity.student.department
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'PDF generation failed' });
    }

    // Save to DB
    const certificate = new Certificate({
      certificateId,
      activity: activity._id,
      student: activity.student._id,
      issuedBy: req.user.userId,
      title: activity.title,
      organizingBody: activity.organizingBody,
      achievementLevel: activity.achievementLevel,
      eventDate: activity.eventDate,
      pdfPath: `virtual://${certificateId}`,  // on-demand generation
      verificationCode,
      status: 'active'
    });

    await certificate.save();

    // Link back to activity
    await Activity.findByIdAndUpdate(activityId, {
      certificate: certificate._id,
      certificateId,
      status: 'certified',
      certificateGeneratedAt: new Date()
    });

    // Stream PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificateId}.pdf"`);
    res.send(result.pdfBuffer);

  } catch (error) {
    console.error('Generate cert error:', error);
    res.status(500).json({ error: 'Something went wrong generating certificate' });
  }
};

// Public verify endpoint - recruiters paste cert ID here
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department email')
      .populate('activity', 'title category organizingBody achievementLevel eventDate')
      .lean();

    if (!cert) {
      return res.status(404).json({
        status: 'not_found',
        message: 'Certificate not found. Double-check the ID.'
      });
    }

    // Is it still valid?
    const now = new Date();
    const isValid = cert.status === 'active' &&
      !cert.isRevoked &&
      (!cert.expiresAt || cert.expiresAt > now);

    if (!isValid) {
      return res.status(410).json({
        status: 'invalid',
        message: 'Certificate expired, revoked, or cancelled.',
        data: {
          certId: cert.certificateId,
          student: cert.student?.name || 'Unknown',
          title: cert.activity?.title || 'Achievement',
          issued: cert.issuedAt
        }
      });
    }

    // Valid! Send recruiter-friendly response
    const data = {
      status: 'valid',
      certId: cert.certificateId,
      student: cert.student.name,
      rollNo: cert.student.rollNumber,
      department: cert.student.department,
      achievement: cert.activity.title,
      category: cert.activity.category,
      organizer: cert.activity.organizingBody,
      level: cert.activity.achievementLevel,
      eventDate: cert.activity.eventDate,
      issued: cert.issuedAt,
      verifiedCount: cert.verificationCount || 0
    };

    // Track verification (async, don't block)
    Certificate.updateOne({ _id: cert._id }, {
      $inc: { verificationCount: 1 },
      $set: { lastVerifiedAt: now }
    }).catch(err => console.log('Stats update failed:', err));

    res.json(data);

  } catch (error) {
    console.error('Verify error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Service temporarily down. Try again in a minute.'
    });
  }
};

// Admin dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Certificate.aggregate([{
      $facet: {
        total: [{ $count: 'count' }],
        active: [{ $match: { status: 'active' } }, { $count: 'count' }],
        revoked: [{ $match: { isRevoked: true } }, { $count: 'count' }]
      }
    }]);

    res.json({
      success: true,
      stats: stats[0] || { total: [{ count: 0 }], active: [{ count: 0 }], revoked: [{ count: 0 }] }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Stats unavailable' });
  }
};

// Student re-downloads their cert PDF
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department')
      .populate('activity', 'title organizingBody eventDate achievementLevel');

    if (!cert || cert.status !== 'active') {
      return res.status(404).json({ error: 'Certificate not found or expired' });
    }

    const result = await certificateService.generateCertificate({
      studentName: cert.student.name,
      achievement: cert.activity.title,
      organizingBody: cert.activity.organizingBody,
      eventDate: cert.activity.eventDate,
      achievementLevel: cert.activity.achievementLevel,
      certificateId: cert.certificateId,
      rollNo: cert.student.rollNumber,
      department: cert.student.department
    });

    if (!result.success) {
      return res.status(500).json({ error: 'PDF generation failed' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`);
    res.send(result.pdfBuffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
};