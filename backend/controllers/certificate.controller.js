const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const certificateService = require('../services/certificateService');
const path = require('path');
const fs = require('fs');

exports.generateCertificate = async (req, res) => {
 // console.log('CERT ROUTE HIT - activityId:', req.params.activityId);
  
  try {
    const { activityId } = req.params;
    const activity = await Activity.findById(activityId)
      .populate('student', 'name email rollNumber department');

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.status !== 'approved') {
      return res.status(400).json({ error: `Activity must be 'approved', current: '${activity.status}'` });
    }

    if (!activity.student) {
      return res.status(400).json({ error: 'Student data missing' });
    }

    // Generate unique certificate
    const certificateId = `CERT_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationCode = crypto.randomBytes(10).toString('hex');

    // Generate PDF
    const result = await certificateService.generateCertificate({
      studentName: activity.student.name,
      achievement: activity.title,
      organizingBody: activity.organizingBody || 'AchievR Platform',
      eventDate: activity.eventDate || new Date().toISOString().split('T')[0],
      achievementLevel: activity.achievementLevel || 'Achievement',
      certificateId,
      rollNo: activity.student.rollNumber,
      department: activity.student.department
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'PDF generation failed' });
    }

    // Save PDF to uploads folder
    const filename = `${certificateId}.pdf`;
    const uploadPath = path.join(__dirname, '../uploads', filename);
    fs.writeFileSync(uploadPath, result.pdfBuffer);

    // Create & save certificate record
    const certificate = new Certificate({
      certificateId,
      activity: activity._id,
      student: activity.student._id,
      issuedBy: req.user.userId,
      title: activity.title,
      organizingBody: activity.organizingBody,
      achievementLevel: activity.achievementLevel,
      eventDate: activity.eventDate,
      pdfPath: `/uploads/${filename}`,
      verificationCode,
      status: 'active'
    });

    await certificate.save();

    // Update activity
    await Activity.findByIdAndUpdate(activityId, {
      certificate: certificate._id,
      certificateId,
      status: 'certified',
      certificateGeneratedAt: new Date()
    });

    // Send PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificateId}.pdf"`);
    res.send(result.pdfBuffer);

  } catch (error) {
    console.error('Generate cert error:', error.message);
    res.status(500).json({ error: 'Certificate generation failed' });
  }
};

exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name rollNumber department')
      .populate('activity', 'title organizingBody eventDate achievementLevel');

    if (!cert || cert.status !== 'active') {
      return res.status(404).json({ error: 'Valid certificate not found' });
    }

    // Serve from uploads folder
    const filePath = path.join(__dirname, '../uploads', cert.pdfPath.split('/').pop());
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`);
    res.sendFile(filePath);

  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).json({ error: 'Download failed' });
  }
};

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
        message: 'Certificate not found'
      });
    }

    const now = new Date();
    const isValid = cert.status === 'active' && 
                   !cert.isRevoked && 
                   (!cert.expiresAt || cert.expiresAt > now);

    if (!isValid) {
      return res.status(410).json({
        status: 'invalid',
        message: 'Certificate expired or revoked'
      });
    }

    // Update verification stats
    await Certificate.updateOne(
      { _id: cert._id }, 
      { 
        $inc: { verificationCount: 1 },
        $set: { lastVerifiedAt: now }
      }
    );

    res.json({
      status: 'valid',
      data: {
        certId: cert.certificateId,
        student: cert.student?.name,
        rollNo: cert.student?.rollNumber,
        department: cert.student?.department,
        achievement: cert.activity?.title,
        category: cert.activity?.category,
        organizer: cert.activity?.organizingBody,
        level: cert.activity?.achievementLevel,
        eventDate: cert.activity?.eventDate,
        issued: cert.issuedAt,
        verifiedCount: cert.verificationCount || 0
      }
    });

  } catch (error) {
    console.error('Verify error:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Verification service unavailable' 
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Certificate.aggregate([{
      $facet: {
        total: [{ $count: 'count' }],
        active: [{ $match: { status: 'active' } }, { $count: 'count' }],
        revoked: [{ $match: { isRevoked: true } }, { $count: 'count' }],
        today: [{ $match: { createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } } }, { $count: 'count' }]
      }
    }]);

    res.json({
      success: true,
      stats: stats[0] || { total: [{count:0}], active: [{count:0}], revoked: [{count:0}], today: [{count:0}] }
    });

  } catch (error) {
    console.error('Stats error:', error.message);
    res.status(500).json({ error: 'Stats unavailable' });
  }
};