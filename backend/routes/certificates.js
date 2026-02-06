// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');
// const Certificate = require('../models/Certificate');
// const Activity = require('../models/Activity');
// const User = require('../models/User');
// const authMiddleware = require('../middleware/auth');
// const emailService = require('../utils/emailService');
// const certificateService = require('../services/certificateService');

// // ========== GENERATE CERTIFICATE WITH QR ==========
// router.post('/generate/:activityId', authMiddleware, async (req, res) => {
//   try {
//     console.log('\n' + '='.repeat(70));
//     console.log('📜 GENERATING CERTIFICATE WITH QR');
//     console.log('='.repeat(70));

//     const activity = await Activity.findById(req.params.activityId)
//       .populate('student', 'name email');

//     if (!activity) {
//       console.log('❌ Activity not found');
//       return res.status(404).json({ error: 'Activity not found' });
//     }

//     const certificateId = `CERT_${activity._id.toString().slice(0, 8)}_${Date.now()}`;
    
//     console.log(`✅ Activity: ${activity.title}`);
//     console.log(`✅ Student: ${activity.student.name}`);
//     console.log(`✅ Certificate ID: ${certificateId}`);

//     // ✅ USE PDFKIT SERVICE - NOT TXT FILE
//     const result = await certificateService.generateCertificateWithQR({
//       studentName: activity.student.name,
//       achievement: activity.title,
//       organizingBody: activity.organizingBody || 'Unknown',
//       eventDate: activity.eventDate,
//       achievementLevel: activity.achievementLevel || 'College',
//       certificateId: certificateId
//     });

//     if (!result.success) {
//       console.log('❌ Generation failed:', result.error);
//       return res.status(500).json({ error: result.error });
//     }

//     console.log('✅ PDF generated successfully');
//     console.log('='.repeat(70) + '\n');

//     // ✅ RETURN BUFFER AS BASE64
//     res.json({
//       success: true,
//       certificateId,
//       pdfBuffer: result.pdfBuffer.toString('base64'),
//       studentName: activity.student.name,
//       studentEmail: activity.student.email,
//       studentId: activity.student._id,
//       achievement: activity.title,
//       organizingBody: activity.organizingBody,
//       achievementLevel: activity.achievementLevel,
//       eventDate: activity.eventDate?.toLocaleDateString(),
//       fileSize: result.fileSize
//     });

//   } catch (error) {
//     console.error('❌ ERROR:', error.message);
//     console.log('='.repeat(70) + '\n');
//     res.status(500).json({ error: error.message });
//   }
// });

// // ========== SUBMIT & SEND EMAIL ==========
// router.post('/submit/:activityId', authMiddleware, async (req, res) => {
//   try {
//     console.log('\n' + '='.repeat(70));
//     console.log('📧 CERTIFICATE SUBMIT & EMAIL');
//     console.log('='.repeat(70));

//     const {
//       certificateId,
//       pdfBuffer,
//       studentName,
//       studentEmail,
//       studentId,
//       achievement,
//       organizingBody,
//       achievementLevel,
//       eventDate
//     } = req.body;

//     console.log('✅ Payload received');
//     console.log(`   Certificate ID: ${certificateId}`);
//     console.log(`   Email: ${studentEmail}`);
//     console.log(`   PDF Buffer present: ${!!pdfBuffer}`);

//     if (!certificateId || !pdfBuffer || !studentEmail || !studentName) {
//       console.log('❌ Missing required fields');
//       return res.status(400).json({ error: 'Missing certificateId, pdfBuffer, studentEmail, or studentName' });
//     }

//     const verificationCode = crypto.randomBytes(16).toString('hex');

//     // ✅ CHECK IF CERTIFICATE ALREADY EXISTS
//     let certificate = await Certificate.findOne({ certificateId });
    
//     if (certificate) {
//       console.log('⚠️ Certificate exists, updating...');
//       certificate.verificationCode = verificationCode;
//       certificate.emailStatus = 'pending';
//     } else {
//       certificate = new Certificate({
//         certificateId,
//         activity: req.params.activityId,
//         student: studentId,
//         issuedBy: req.user.userId,
//         title: achievement,
//         organizingBody,
//         achievementLevel,
//         eventDate,
//         pdfPath: 'in-memory',
//         verificationCode,
//         status: 'active'
//       });
//     }

//     await certificate.save();
//     console.log('✅ Certificate saved to DB');

//     // SEND EMAIL
//     console.log('📧 Sending email...');
//     try {
//       const emailResult = await emailService.sendCertificateEmail(
//         studentEmail,
//         studentName,
//         {
//           certificateId,
//           pdfBuffer,
//           achievement,
//           organizingBody,
//           eventDate,
//           achievementLevel,
//           verificationCode
//         }
//       );

//       if (emailResult.success) {
//         await certificate.recordEmailSent(studentEmail, emailResult.messageId, 'sent');
//         console.log('✅ Email sent successfully');
//       } else {
//         await certificate.recordEmailSent(studentEmail, 'N/A', 'failed', emailResult.error);
//         console.log('⚠️ Email failed:', emailResult.error);
//       }
//     } catch (emailError) {
//       console.error('⚠️ Email error:', emailError.message);
//       await certificate.recordEmailSent(studentEmail, 'N/A', 'failed', emailError.message);
//     }

//     // UPDATE ACTIVITY
//     await Activity.findByIdAndUpdate(req.params.activityId, {
//       certificate: certificate._id,
//       certificateId,
//       status: 'certified',
//       certificateGeneratedAt: new Date()
//     });

//     console.log('✅ Activity updated');
//     console.log('='.repeat(70));
//     console.log('🎉 SUCCESS!\n');

//     res.json({
//       success: true,
//       message: '✅ Certificate created and emailed!',
//       certificateId,
//       studentEmail,
//       emailStats: certificate.getEmailStats()
//     });

//   } catch (error) {
//     console.error('❌ ERROR:', error.message);
//     console.log('='.repeat(70) + '\n');
//     res.status(500).json({ error: error.message });
//   }
// });

// // ========== VERIFY CERTIFICATE (PUBLIC - NO AUTH NEEDED) ==========
// router.get('/verify/:certificateId', async (req, res) => {
//   try {
//     console.log('\n' + '='.repeat(70));
//     console.log(`🔍 CERTIFICATE VERIFICATION: ${req.params.certificateId}`);
//     console.log('='.repeat(70));

//     // ✅ FIX: Find by certificateId (not MongoDB _id)
//     const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
//       .populate('student', 'name email rollNumber')
//       .populate('activity', 'title category');

//     if (!certificate) {
//       console.log('❌ Certificate not found');
//       return res.status(404).json({
//         verified: false,
//         authentic: false,
//         message: 'Certificate not found'
//       });
//     }

//     console.log(`✅ Certificate found: ${certificate.certificateId}`);
//     console.log(`✅ Valid: ${certificate.isValid}`);

//     if (!certificate.isValid) {
//       console.log('❌ Certificate is not valid (revoked or expired)');
//       return res.status(400).json({
//         verified: false,
//         authentic: false,
//         message: 'Certificate is revoked or expired'
//       });
//     }

//     // Record verification
//     await certificate.recordVerification(
//       req.query.email || 'public',
//       req.ip || req.connection.remoteAddress
//     );

//     console.log(`✅ Verification recorded (Total: ${certificate.verificationCount})`);
//     console.log('='.repeat(70) + '\n');

//     res.json({
//       verified: true,
//       authentic: true,
//       data: {
//         certificateId: certificate.certificateId,
//         studentName: certificate.student.name,
//         studentRollNumber: certificate.student.rollNumber,
//         achievement: certificate.activity.title,
//         achievementCategory: certificate.activity.category,
//         organizingBody: certificate.organizingBody,
//         achievementLevel: certificate.achievementLevel,
//         issuedDate: certificate.issuedAt,
//         expiresDate: certificate.expiresAt,
//         status: certificate.status,
//         isValid: certificate.isValid,
//         daysUntilExpiry: certificate.daysUntilExpiry,
//         verificationCount: certificate.verificationCount,
//         message: '✅ This is an authentic certificate issued by AchievR System'
//       }
//     });

//   } catch (error) {
//     console.error('❌ Verification error:', error.message);
//     console.log('='.repeat(70) + '\n');
//     res.status(500).json({
//       verified: false,
//       error: error.message
//     });
//   }
// });

// // ========== BULK SEND - MULTIPLE STUDENTS ==========
// router.post('/bulk-send', authMiddleware, async (req, res) => {
//   try {
//     console.log('\n' + '='.repeat(70));
//     console.log('📧 BULK SENDING CERTIFICATES');
//     console.log('='.repeat(70));

//     const user = await User.findById(req.user.userId);
//     if (user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admin can bulk send' });
//     }

//     const { studentIds } = req.body;

//     if (!studentIds || studentIds.length === 0) {
//       return res.status(400).json({ error: 'No students selected' });
//     }

//     console.log(`📧 Sending to ${studentIds.length} students...`);

//     let successCount = 0;
//     let failCount = 0;
//     const results = [];

//     for (const studentId of studentIds) {
//       try {
//         const certificates = await Certificate.find({ 
//           student: studentId, 
//           emailStatus: { $in: ['pending', 'failed'] }
//         });

//         if (certificates.length === 0) {
//           console.log(`⏭️ Student ${studentId}: No pending certificates`);
//           continue;
//         }

//         const student = await User.findById(studentId);
//         if (!student || !student.email) {
//           console.log(`❌ Student ${studentId}: Email not found`);
//           failCount++;
//           continue;
//         }

//         for (const cert of certificates) {
//           try {
//             const emailResult = await emailService.sendCertificateEmail(
//               student.email,
//               student.name,
//               {
//                 certificateId: cert.certificateId,
//                 pdfBuffer: cert.pdfPath,
//                 achievement: cert.title,
//                 organizingBody: cert.organizingBody,
//                 eventDate: cert.eventDate,
//                 achievementLevel: cert.achievementLevel,
//                 verificationCode: cert.verificationCode
//               }
//             );

//             if (emailResult.success) {
//               await cert.recordEmailSent(student.email, emailResult.messageId, 'sent');
//               successCount++;
//               results.push({ studentName: student.name, certId: cert.certificateId, status: 'sent' });
//               console.log(`✅ Sent to ${student.name}`);
//             }
//           } catch (err) {
//             failCount++;
//             console.error(`❌ Failed for ${student.name}:`, err.message);
//           }
//         }

//       } catch (err) {
//         failCount++;
//         console.error(`❌ Error processing student ${studentId}:`, err.message);
//       }
//     }

//     console.log(`\n📊 Results: ${successCount} sent, ${failCount} failed`);
//     console.log('='.repeat(70) + '\n');

//     res.json({
//       success: true,
//       message: `Sent ${successCount} certificates`,
//       total: studentIds.length,
//       successCount,
//       failCount,
//       results
//     });

//   } catch (error) {
//     console.error('❌ ERROR:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // ========== RESEND ALL TO STUDENT ==========
// router.post('/resend-to-student/:studentId', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (user.role !== 'admin') {
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     const student = await User.findById(req.params.studentId);
//     if (!student) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     const certificates = await Certificate.find({ student: req.params.studentId, status: 'active' });

//     if (certificates.length === 0) {
//       return res.status(404).json({ error: 'No certificates found' });
//     }

//     console.log(`📧 Resending ${certificates.length} certificates to ${student.name}...`);

//     let successCount = 0;

//     for (const cert of certificates) {
//       try {
//         const emailResult = await emailService.sendCertificateEmail(
//           student.email,
//           student.name,
//           {
//             certificateId: cert.certificateId,
//             pdfBuffer: cert.pdfPath,
//             achievement: cert.title,
//             organizingBody: cert.organizingBody,
//             eventDate: cert.eventDate,
//             achievementLevel: cert.achievementLevel,
//             verificationCode: cert.verificationCode
//           }
//         );

//         if (emailResult.success) {
//           await cert.recordEmailSent(student.email, emailResult.messageId, 'sent');
//           successCount++;
//         }
//       } catch (err) {
//         console.error(`Error sending cert ${cert.certificateId}:`, err.message);
//       }
//     }

//     res.json({
//       success: true,
//       message: `Resent ${successCount}/${certificates.length} certificates`,
//       studentEmail: student.email,
//       total: certificates.length
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ========== DOWNLOAD ==========
// router.get('/download/:certificateId', async (req, res) => {
//   try {
//     const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    
//     if (!certificate) {
//       return res.status(404).json({ error: 'Certificate not found' });
//     }

//     // For in-memory PDFs, we can't download directly
//     if (certificate.pdfPath === 'in-memory') {
//       return res.status(400).json({ error: 'Certificate is stored in-memory. Please request a new certificate.' });
//     }

//     if (!fs.existsSync(certificate.pdfPath)) {
//       return res.status(404).json({ error: 'Certificate file not found' });
//     }

//     await Certificate.updateOne({ _id: certificate._id }, { $inc: { downloadCount: 1 } });
//     res.download(path.resolve(certificate.pdfPath), `${certificate.certificateId}.pdf`);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ========== GET CERTIFICATE STATS ==========
// router.get('/stats', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (user.role !== 'admin') {
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     const stats = await Certificate.aggregate([
//       {
//         $facet: {
//           total: [{ $count: 'count' }],
//           active: [{ $match: { status: 'active', isRevoked: false } }, { $count: 'count' }],
//           revoked: [{ $match: { isRevoked: true } }, { $count: 'count' }],
//           emailSent: [{ $match: { emailStatus: 'sent' } }, { $count: 'count' }],
//           emailFailed: [{ $match: { emailStatus: 'failed' } }, { $count: 'count' }]
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       stats: stats[0]
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const { generateCertificate, verifyCertificate, getStats} = require('../controllers/certificate.controller');

// Generate + download PDF
router.post('/generate/:activityId', authMiddleware, generateCertificate);

// Verify (optional public)
router.get('/verify/:certificateId', verifyCertificate);

// Admin stats
router.get('/stats', authMiddleware, getStats);

module.exports = router;