const express = require('express');
const Activity = require('../models/Activity');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth');


router.get('/student/:studentId', async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('FETCHING RECRUITER VIEW - STUDENT PROFILE');
    console.log('='.repeat(70));

    const { studentId } = req.params;

    // Validate studentId
    if (!studentId || studentId.length !== 24) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID'
      });
    }

    // Check if student exists
    const student = await User.findById(studentId).select('name email rollNumber department year createdAt');
    
    if (!student) {
      console.log('Student not found');
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    console.log(`Student found: ${student.name}`);

    // Find all certified activities for the student
    const certifiedActivities = await Activity.find({
      student: studentId,
      status: 'certified'
    })
      .populate('student', 'name email rollNumber department')
      .populate('certificate', 'certificateId verificationCode')
      .sort({ certifiedAt: -1 });

    console.log(`Found ${certifiedActivities.length} certified activities`);

    if (certifiedActivities.length === 0) {
      console.log('No certified activities found');
      return res.json({
        success: true,
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          rollNumber: student.rollNumber,
          department: student.department,
          joinedYear: student.year,
          memberSince: student.createdAt
        },
        totalCertifiedActivities: 0,
        skills: {
          technical: [],
          soft: [],
          tools: []
        },
        activities: [],
        message: 'No certified activities yet'
      });
    }

    // Aggregate skills from all activities
    const allSkills = {
      technical: new Set(),
      soft: new Set(),
      tools: new Set()
    };

    certifiedActivities.forEach(activity => {
      activity.selectedTechnicalSkills?.forEach(s => allSkills.technical.add(s));
      activity.selectedSoftSkills?.forEach(s => allSkills.soft.add(s));
      activity.selectedTools?.forEach(t => allSkills.tools.add(t));
    });

    // console.log(`Aggregated skills:`);
    // console.log(`   - Technical: ${allSkills.technical.size}`);
    // console.log(`   - Soft: ${allSkills.soft.size}`);
    // console.log(`   - Tools: ${allSkills.tools.size}`);

    // Format activities with certificate information
    const formattedActivities = await Promise.all(
      certifiedActivities.map(async (activity) => {
        // Get certificate details
        let certificateInfo = null;
        if (activity.certificate) {
          const cert = await Certificate.findById(activity.certificate).select(
            'certificateId verificationCode pdfPath downloadCount'
          );
          certificateInfo = cert;
        }

        return {
          id: activity._id,
          title: activity.title,
          description: activity.description,
          category: activity.category,
          achievementLevel: activity.achievementLevel || 'College',
          organizingBody: activity.organizingBody || 'Institute',
          eventDate: activity.eventDate,
          certifiedAt: activity.certifiedAt,
          technicalSkills: activity.selectedTechnicalSkills || [],
          softSkills: activity.selectedSoftSkills || [],
          tools: activity.selectedTools || [],
          qrCodeUrl: activity.qrCodeUrl,
          certificate: certificateInfo ? {
            certificateId: certificateInfo.certificateId,
            downloadCount: certificateInfo.downloadCount || 0,
            verifiedOn: activity.certifiedAt
          } : null
        };
      })
    );

  console.log(`Formatted ${formattedActivities.length} activities`);
   console.log('='.repeat(70) + '\n');

    // Send response
    res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        joinedYear: student.year,
        memberSince: student.createdAt
      },
      totalCertifiedActivities: certifiedActivities.length,
      skills: {
        technical: Array.from(allSkills.technical).sort(),
        soft: Array.from(allSkills.soft).sort(),
        tools: Array.from(allSkills.tools).sort()
      },
      activities: formattedActivities
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET CURRENT USER'S SHAREABLE PROFILE 
router.get('/my-profile', authMiddleware, async (req, res) => {
  try {
    // console.log('\n' + '='.repeat(70));
    // console.log('FETCHING MY SHAREABLE PROFILE');
    // console.log('='.repeat(70));

    const userId = req.user.userId || req.user.id;

    const user = await User.findById(userId).select(
      'name email rollNumber department year'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const certifiedActivities = await Activity.find({
      student: userId,
      status: 'certified'
    })
      .populate('certificate', 'certificateId verificationCode')
      .sort({ certifiedAt: -1 });

   // console.log(`Found ${certifiedActivities.length} certified activities`);

    // Aggregate skills
    const allSkills = {
      technical: new Set(),
      soft: new Set(),
      tools: new Set()
    };

    certifiedActivities.forEach(activity => {
      activity.selectedTechnicalSkills?.forEach(s => allSkills.technical.add(s));
      activity.selectedSoftSkills?.forEach(s => allSkills.soft.add(s));
      activity.selectedTools?.forEach(t => allSkills.tools.add(t));
    });

    const formattedActivities = certifiedActivities.map(activity => ({
      id: activity._id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      achievementLevel: activity.achievementLevel || 'College',
      organizingBody: activity.organizingBody,
      eventDate: activity.eventDate,
      certifiedAt: activity.certifiedAt,
      technicalSkills: activity.selectedTechnicalSkills || [],
      softSkills: activity.selectedSoftSkills || [],
      tools: activity.selectedTools || [],
      qrCodeUrl: activity.qrCodeUrl,
      certificate: activity.certificate ? {
        certificateId: activity.certificate.certificateId,
        verifiedOn: activity.certifiedAt
      } : null
    }));

    // FIXED SHAREABLE LINK
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const shareableLink = `${FRONTEND_URL}/recruiter-view/${user._id}`;

   // console.log(`Generated shareable link: ${shareableLink}`);
   // console.log('='.repeat(70) + '\n');

    res.json({
      success: true,
      shareableLink,
      student: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        joinedYear: user.year
      },
      totalCertifiedActivities: certifiedActivities.length,
      skills: {
        technical: Array.from(allSkills.technical).sort(),
        soft: Array.from(allSkills.soft).sort(),
        tools: Array.from(allSkills.tools).sort()
      },
      activities: formattedActivities
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;