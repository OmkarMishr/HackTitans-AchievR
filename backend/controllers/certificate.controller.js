const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const certificateService = require('../services/certificateService');


//GENERATE CERTIFICATE
exports.generateCertificate = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId)
      .populate('student', 'name email rollNumber department');

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const certificateId = `CERT_${Date.now()}`;
    const verificationCode = crypto.randomBytes(10).toString('hex');

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
      return res.status(500).json({ error: result.error });
    }

    const certificate = new Certificate({
      certificateId,
      activity: activity._id,
      student: activity.student._id,
      issuedBy: req.user.userId,
      title: activity.title,
      organizingBody: activity.organizingBody,
      achievementLevel: activity.achievementLevel,
      eventDate: activity.eventDate,
      pdfPath: `virtual://${certificateId}`,
      verificationCode,
      status: 'active'
    });

    await certificate.save();

    await Activity.findByIdAndUpdate(activityId, {
      certificate: certificate._id,
      certificateId,
      status: 'certified',
      certificateGeneratedAt: new Date()
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${certificateId}.pdf`
    );

    res.send(result.pdfBuffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  VERIFY CERTIFICATE 
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department')
      .populate('activity', 'title category');

    if (!certificate) {
      return res.status(404).json({
        verified: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      verified: true,
      data: {
        certificateId: certificate.certificateId,
        student: certificate.student.name,
        rollNumber: certificate.student.rollNumber,
        department: certificate.student.department,
        title: certificate.activity.title,
        category: certificate.activity.category,
        issuedAt: certificate.createdAt,
        status: certificate.status
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  CERTIFICATE STATS 
exports.getStats = async (req, res) => {
  try {
    const stats = await Certificate.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { status: 'active' } }, { $count: 'count' }],
          revoked: [{ $match: { isRevoked: true } }, { $count: 'count' }]
        }
      }
    ]);

    res.json({ success: true, stats: stats[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DOWNLOAD CERTIFICATE
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department')
      .populate('activity', 'title');

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const result = await certificateService.generateCertificate({
      studentName: certificate.student.name,
      achievement: certificate.activity.title,
      organizingBody: certificate.organizingBody,
      eventDate: certificate.eventDate,
      achievementLevel: certificate.achievementLevel,
      certificateId: certificate.certificateId,
      rollNo: certificate.student.rollNumber,
      department: certificate.student.department
    });

    if (!result.success) {
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${certificate.certificateId}.pdf`
    );

    res.send(result.pdfBuffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};