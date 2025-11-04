// routes/recruiter.js
const express = require('express');
const Activity = require('../models/Activity');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// ========== GET STUDENT PUBLIC PROFILE WITH ALL CERTIFIED ACTIVITIES ==========
router.get('/student/:studentId', async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('👤 FETCHING RECRUITER VIEW - STUDENT PROFILE');
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
      console.log('❌ Student not found');
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    console.log(`✅ Student found: ${student.name}`);

    // Find all certified activities for the student
    const certifiedActivities = await Activity.find({
      student: studentId,
      status: 'certified'
    })
      .populate('student', 'name email rollNumber department')
      .populate('certificate', 'certificateId verificationCode')
      .sort({ certifiedAt: -1 });

    console.log(`✅ Found ${certifiedActivities.length} certified activities`);

    if (certifiedActivities.length === 0) {
      console.log('⚠️ No certified activities found');
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

    console.log(`✅ Aggregated skills:`);
    console.log(`   - Technical: ${allSkills.technical.size}`);
    console.log(`   - Soft: ${allSkills.soft.size}`);
    console.log(`   - Tools: ${allSkills.tools.size}`);

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
          qrCodeUrl: activity.qrCodeUrl, // URL to download certificate
          certificate: certificateInfo ? {
            certificateId: certificateInfo.certificateId,
            downloadCount: certificateInfo.downloadCount || 0,
            verifiedOn: activity.certifiedAt
          } : null
        };
      })
    );

    console.log(`✅ Formatted ${formattedActivities.length} activities`);
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
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== GET CURRENT USER'S SHAREABLE PROFILE ==========
router.get('/my-profile', authMiddleware, async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('👤 FETCHING MY SHAREABLE PROFILE');
    console.log('='.repeat(70));

    const userId = req.user.userId || req.user.id;

    const user = await User.findById(userId).select('name email rollNumber department year');

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

    console.log(`✅ Found ${certifiedActivities.length} certified activities`);

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

    // Format activities
    const formattedActivities = await Promise.all(
      certifiedActivities.map(async (activity) => {
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
          organizingBody: activity.organizingBody,
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

    const shareableLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/recruiter-view/${userId}`;

    console.log(`✅ Generated shareable link: ${shareableLink}`);
    console.log('='.repeat(70) + '\n');

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
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== SEARCH STUDENTS BY SKILLS ==========
router.post('/search-by-skills', async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('🔍 SEARCHING STUDENTS BY SKILLS');
    console.log('='.repeat(70));

    const { skills = [], skillType = 'all' } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one skill to search'
      });
    }

    console.log(`🔍 Searching for skills: ${skills.join(', ')}`);
    console.log(`📊 Skill type: ${skillType}`);

    let query = { status: 'certified' };

    if (skillType === 'technical') {
      query.selectedTechnicalSkills = { $in: skills };
    } else if (skillType === 'soft') {
      query.selectedSoftSkills = { $in: skills };
    } else if (skillType === 'tools') {
      query.selectedTools = { $in: skills };
    } else {
      // Search across all skill types
      query.$or = [
        { selectedTechnicalSkills: { $in: skills } },
        { selectedSoftSkills: { $in: skills } },
        { selectedTools: { $in: skills } }
      ];
    }

    const matchedActivities = await Activity.find(query)
      .populate('student', 'name rollNumber department email')
      .sort({ certifiedAt: -1 });

    console.log(`✅ Found ${matchedActivities.length} matching activities`);

    // Group by student
    const studentActivityMap = {};

    matchedActivities.forEach(activity => {
      const studentId = activity.student._id.toString();

      if (!studentActivityMap[studentId]) {
        studentActivityMap[studentId] = {
          student: activity.student,
          activities: [],
          allSkills: { technical: new Set(), soft: new Set(), tools: new Set() }
        };
      }

      studentActivityMap[studentId].activities.push(activity);
      activity.selectedTechnicalSkills?.forEach(s =>
        studentActivityMap[studentId].allSkills.technical.add(s)
      );
      activity.selectedSoftSkills?.forEach(s =>
        studentActivityMap[studentId].allSkills.soft.add(s)
      );
      activity.selectedTools?.forEach(t =>
        studentActivityMap[studentId].allSkills.tools.add(t)
      );
    });

    console.log(`✅ Grouped into ${Object.keys(studentActivityMap).length} unique students`);

    const results = Object.values(studentActivityMap).map(item => ({
      student: {
        id: item.student._id,
        name: item.student.name,
        rollNumber: item.student.rollNumber,
        department: item.student.department,
        email: item.student.email,
        profileUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/recruiter-view/${item.student._id}`
      },
      totalCertifiedActivities: item.activities.length,
      skills: {
        technical: Array.from(item.allSkills.technical).sort(),
        soft: Array.from(item.allSkills.soft).sort(),
        tools: Array.from(item.allSkills.tools).sort()
      },
      activities: item.activities.map(a => ({
        title: a.title,
        description: a.description,
        category: a.category,
        level: a.achievementLevel,
        certifiedAt: a.certifiedAt
      }))
    }));

    console.log(`📊 Returning ${results.length} student profiles`);
    console.log('='.repeat(70) + '\n');

    res.json({
      success: true,
      resultCount: results.length,
      skills: skills,
      skillType: skillType,
      results: results
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== GET TOP SKILLED STUDENTS ==========
router.get('/top-students', async (req, res) => {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('⭐ FETCHING TOP SKILLED STUDENTS');
    console.log('='.repeat(70));

    const limit = parseInt(req.query.limit) || 10;

    // Get all certified activities grouped by student
    const activities = await Activity.find({ status: 'certified' })
      .populate('student', 'name rollNumber department email')
      .sort({ certifiedAt: -1 });

    console.log(`✅ Found ${activities.length} certified activities`);

    // Group and score students
    const studentScores = {};

    activities.forEach(activity => {
      const studentId = activity.student._id.toString();

      if (!studentScores[studentId]) {
        studentScores[studentId] = {
          student: activity.student,
          certifiedCount: 0,
          skillCount: 0,
          skills: { technical: new Set(), soft: new Set(), tools: new Set() },
          score: 0
        };
      }

      studentScores[studentId].certifiedCount++;

      // Calculate skill score
      const technicalCount = activity.selectedTechnicalSkills?.length || 0;
      const softCount = activity.selectedSoftSkills?.length || 0;
      const toolCount = activity.selectedTools?.length || 0;

      studentScores[studentId].skillCount += technicalCount + softCount + toolCount;

      activity.selectedTechnicalSkills?.forEach(s =>
        studentScores[studentId].skills.technical.add(s)
      );
      activity.selectedSoftSkills?.forEach(s =>
        studentScores[studentId].skills.soft.add(s)
      );
      activity.selectedTools?.forEach(t =>
        studentScores[studentId].skills.tools.add(t)
      );
    });

    // Calculate composite score
    Object.values(studentScores).forEach(item => {
      item.score = (item.certifiedCount * 10) + item.skillCount;
    });

    // Sort and limit
    const topStudents = Object.values(studentScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        student: {
          id: item.student._id,
          name: item.student.name,
          rollNumber: item.student.rollNumber,
          department: item.student.department,
          email: item.student.email,
          profileUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/recruiter-view/${item.student._id}`
        },
        certifiedActivities: item.certifiedCount,
        totalSkills: item.skillCount,
        score: item.score,
        skills: {
          technical: Array.from(item.skills.technical),
          soft: Array.from(item.skills.soft),
          tools: Array.from(item.skills.tools)
        }
      }));

    console.log(`✅ Returning top ${topStudents.length} students`);
    console.log('='.repeat(70) + '\n');

    res.json({
      success: true,
      count: topStudents.length,
      students: topStudents
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== GET DEPARTMENT STATISTICS ==========
router.get('/department-stats/:department', async (req, res) => {
  try {
    const { department } = req.params;

    console.log(`\n📊 Fetching statistics for department: ${department}`);

    // Find all students in the department
    const students = await User.find({ department, role: 'student' }).select('_id name');

    // Get certified activities for these students
    const activities = await Activity.find({
      student: { $in: students.map(s => s._id) },
      status: 'certified'
    });

    // Aggregate statistics
    const stats = {
      totalStudents: students.length,
      totalActivities: activities.length,
      averageActivitiesPerStudent: students.length > 0 ? (activities.length / students.length).toFixed(2) : 0,
      skills: { technical: new Set(), soft: new Set(), tools: new Set() }
    };

    activities.forEach(activity => {
      activity.selectedTechnicalSkills?.forEach(s => stats.skills.technical.add(s));
      activity.selectedSoftSkills?.forEach(s => stats.skills.soft.add(s));
      activity.selectedTools?.forEach(t => stats.skills.tools.add(t));
    });

    res.json({
      success: true,
      department,
      stats: {
        totalStudents: stats.totalStudents,
        totalActivities: stats.totalActivities,
        averageActivitiesPerStudent: stats.averageActivitiesPerStudent,
        totalUniqueSkills: {
          technical: stats.skills.technical.size,
          soft: stats.skills.soft.size,
          tools: stats.skills.tools.size
        }
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
