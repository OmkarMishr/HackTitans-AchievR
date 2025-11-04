const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const emailService = require('../utils/emailService');
const certificateService = require('../services/certificateService'); // ✅ ADD THIS

// ========== GENERATE CERTIFICATE WITH QR ==========
router.post('/generate/:activityId', authMiddleware, async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('📜 GENERATING CERTIFICATE WITH QR');
    console.log('='.repeat(70));

    const activity = await Activity.findById(req.params.activityId)
      .populate('student', 'name email');

    if (!activity) {
      console.log('❌ Activity not found');
      return res.status(404).json({ error: 'Activity not found' });
    }

    const certificateId = `CERT_${activity._id.toString().slice(0, 8)}_${Date.now()}`;
    
    console.log(`✅ Activity: ${activity.title}`);
    console.log(`✅ Student: ${activity.student.name}`);
    console.log(`✅ Certificate ID: ${certificateId}`);

    // ✅ USE PDFKIT SERVICE - NOT TXT FILE
    const result = await certificateService.generateCertificateWithQR({
      studentName: activity.student.name,
      achievement: activity.title,
      organizingBody: activity.organizingBody || 'Unknown',
      eventDate: activity.eventDate,
      achievementLevel: activity.achievementLevel || 'College',
      certificateId: certificateId
    });

    if (!result.success) {
      console.log('❌ Generation failed:', result.error);
      return res.status(500).json({ error: result.error });
    }

    console.log('✅ PDF generated successfully');
    console.log('='.repeat(70) + '\n');

    // ✅ RETURN BUFFER AS BASE64
    res.json({
      success: true,
      certificateId,
      pdfBuffer: result.pdfBuffer.toString('base64'),
      studentName: activity.student.name,
      studentEmail: activity.student.email,
      studentId: activity.student._id,
      achievement: activity.title,
      organizingBody: activity.organizingBody,
      achievementLevel: activity.achievementLevel,
      eventDate: activity.eventDate?.toLocaleDateString(),
      fileSize: result.fileSize
    });

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('='.repeat(70) + '\n');
    res.status(500).json({ error: error.message });
  }
});

// ========== SUBMIT & SEND EMAIL ==========
router.post('/submit/:activityId', authMiddleware, async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('📧 CERTIFICATE SUBMIT & EMAIL');
    console.log('='.repeat(70));

    const {
      certificateId,
      pdfBuffer,  // ✅ EXPECT BUFFER (Base64 string)
      studentName,
      studentEmail,
      studentId,
      achievement,
      organizingBody,
      achievementLevel,
      eventDate
    } = req.body;

    console.log('✅ Payload received');
    console.log(`   Certificate ID: ${certificateId}`);
    console.log(`   Email: ${studentEmail}`);
    console.log(`   PDF Buffer present: ${!!pdfBuffer}`);

    if (!certificateId || !pdfBuffer || !studentEmail || !studentName) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing certificateId, pdfBuffer, studentEmail, or studentName' });
    }

    const verificationCode = crypto.randomBytes(16).toString('hex');

    // ✅ CHECK IF CERTIFICATE ALREADY EXISTS
    let certificate = await Certificate.findOne({ certificateId });
    
    if (certificate) {
      console.log('⚠️ Certificate exists, updating...');
      certificate.verificationCode = verificationCode;
      certificate.emailStatus = 'pending';
    } else {
      certificate = new Certificate({
        certificateId,
        activity: req.params.activityId,
        student: studentId,
        issuedBy: req.user.userId,
        title: achievement,
        organizingBody,
        achievementLevel,
        eventDate,
        pdfPath: 'in-memory', // ✅ MARK AS IN-MEMORY
        verificationCode,
        status: 'active'
      });
    }

    await certificate.save();
    console.log('✅ Certificate saved to DB');

    // SEND EMAIL
    console.log('📧 Sending email...');
    try {
      const emailResult = await emailService.sendCertificateEmail(
        studentEmail,
        studentName,
        {
          certificateId,
          pdfBuffer,  // ✅ PASS BASE64 BUFFER
          achievement,
          organizingBody,
          eventDate,
          achievementLevel,
          verificationCode
        }
      );

      if (emailResult.success) {
        await certificate.recordEmailSent(studentEmail, emailResult.messageId, 'sent');
        console.log('✅ Email sent successfully');
      } else {
        await certificate.recordEmailSent(studentEmail, 'N/A', 'failed', emailResult.error);
        console.log('⚠️ Email failed:', emailResult.error);
      }
    } catch (emailError) {
      console.error('⚠️ Email error:', emailError.message);
      await certificate.recordEmailSent(studentEmail, 'N/A', 'failed', emailError.message);
    }

    // UPDATE ACTIVITY
    await Activity.findByIdAndUpdate(req.params.activityId, {
      certificate: certificate._id,
      certificateId,
      status: 'certified',
      certificateGeneratedAt: new Date()
    });

    console.log('✅ Activity updated');
    console.log('='.repeat(70));
    console.log('🎉 SUCCESS!\n');

    res.json({
      success: true,
      message: '✅ Certificate created and emailed!',
      certificateId,
      studentEmail,
      emailStats: certificate.getEmailStats()
    });

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('='.repeat(70) + '\n');
    res.status(500).json({ error: error.message });
  }
});

// ========== VERIFY (PUBLIC - NO AUTH) ==========
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId)
      .populate('student', 'name email rollNumber')
      .populate('activity', 'title category');

    if (!certificate || !certificate.isValid) {
      return res.status(404).json({ verified: false, message: 'Certificate not found or revoked' });
    }

    await certificate.recordVerification(req.query.email || 'public', req.ip);

    res.json({
      verified: true,
      authentic: true,
      data: {
        certificateId: certificate.certificateId,
        studentName: certificate.student.name,
        achievement: certificate.activity.title,
        issuedDate: certificate.issuedAt,
        status: 'Active',
        verificationCount: certificate.verificationCount,
        message: '✅ This is an authentic certificate issued by AchievR System'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ... Rest of your routes (bulk-send, resend-to-student, download, etc. remain the same)

module.exports = router;
