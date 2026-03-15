const mongoose = require('mongoose');
const Activity = require('../models/Activity');

const User = require('../models/User');

const makeSlug = (name) => {
  return name.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

exports.getPortfolio = async (req, res) => {
  try {
    let { id: identifier } = req.params;

    // Handle both MongoID and slug
    let student;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      student = await User.findById(identifier).select('name email rollNumber department year createdAt slug');
    } else {
      student = await User.findOne({ slug: identifier }).select('name email rollNumber department year createdAt');
    }

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Portfolio not found' 
      });
    }

    //generate slugs if not present...
    if (!student.slug) {
      student.slug = makeSlug(student.name);
      await student.save();
    }

    const certifiedActivities = await Activity.find({
      student: student._id,
      status: 'certified'
    })
      .populate('certificate', 'certificateId verificationCount lastVerifiedAt')
      .sort({ certificateGeneratedAt: -1 });

    const stats = {
      totalCertificates: certifiedActivities.length,
      totalVerifications: certifiedActivities.reduce((sum, a) => sum + (a.certificate?.verificationCount || 0), 0)
    };

    if (stats.totalCertificates === 0) {
      return res.json({
        success: true,
        portfolioUrl: `/recruiter/profile/${student.slug}`,
        student,
        stats,
        activities: [],
        message: `${student.name} has no verified achievements yet`
      });
    }

    // Skills by frequency
    const skillCounts = { technical: {}, soft: {}, tools: {} };
    certifiedActivities.forEach(activity => {
      activity.selectedTechnicalSkills?.forEach(skill => 
        skillCounts.technical[skill] = (skillCounts.technical[skill] || 0) + 1
      );
      activity.selectedSoftSkills?.forEach(skill => 
        skillCounts.soft[skill] = (skillCounts.soft[skill] || 0) + 1
      );
      activity.selectedTools?.forEach(tool => 
        skillCounts.tools[tool] = (skillCounts.tools[tool] || 0) + 1
      );
    });

    const topSkills = {
      technical: Object.entries(skillCounts.technical)
        .sort(([,a], [,b]) => b - a).slice(0, 8).map(([s]) => s),
      soft: Object.entries(skillCounts.soft)
        .sort(([,a], [,b]) => b - a).slice(0, 6).map(([s]) => s),
      tools: Object.entries(skillCounts.tools)
        .sort(([,a], [,b]) => b - a).slice(0, 6).map(([t]) => t)
    };

    // Timeline + verify links
    const timeline = certifiedActivities.map(activity => ({
      title: activity.title,
      category: activity.category,
      level: activity.achievementLevel || 'College',
      organizer: activity.organizingBody,
      eventDate: activity.eventDate,
      certifiedAt: activity.certificateGeneratedAt,
      verifyUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${activity.certificateId}`,
      verifications: activity.certificate?.verificationCount || 0
    }));

    res.json({
      success: true,
      portfolioUrl: `/recruiter/profile/${student.slug}`,
      stats,
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        year: student.year,
        email: student.email,
        joined: student.createdAt
      },
      topSkills,
      timeline,
      activities: timeline
    });

  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ success: false, message: 'Portfolio unavailable' });
  }
};