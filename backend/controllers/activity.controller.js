const Activity = require('../models/Activity');
const StudentSkills = require('../models/StudentSkills');

exports.submitActivity = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            eventDate,
            organizingBody,
            achievementLevel,
            selectedTechnicalSkills,
            selectedSoftSkills,
            selectedTools
        } = req.body;

        const studentId = req.user.userId;

        const techSkills = JSON.parse(selectedTechnicalSkills || '[]');
        const softSkills = JSON.parse(selectedSoftSkills || '[]');
        const tools = JSON.parse(selectedTools || '[]');

        if (techSkills.length === 0 && softSkills.length === 0 && tools.length === 0) {
            return res.status(400).json({ success: false, message: 'Select at least one skill' });
        }
        const activity = new Activity({
            student: studentId,
            title,
            description,
            category,
            eventDate,
            organizingBody,
            achievementLevel,
            selectedTechnicalSkills: techSkills,
            selectedSoftSkills: softSkills,
            selectedTools: tools,
            status: 'pending',
            submittedAt: new Date(),
            proofDocuments: req.file ? [{
                filename: req.file.originalname,
                url: `/uploads/${Date.now()}-${req.file.originalname}`,
                uploadedAt: new Date()
            }] : []
        });

        await activity.save();

        let studentSkills = await StudentSkills.findOne({ student: studentId }); //update student skills

        if (!studentSkills) {
            studentSkills = new StudentSkills({ student: studentId });
        }

        techSkills.forEach(skill => {
            const existing = studentSkills.technicalSkills.find(s => s.name === skill);
            if (existing) existing.frequency += 1;
            else studentSkills.technicalSkills.push({ name: skill, frequency: 1 });
        });

        softSkills.forEach(skill => {
            const existing = studentSkills.softSkills.find(s => s.name === skill);
            if (existing) existing.frequency += 1;
            else studentSkills.softSkills.push({ name: skill, frequency: 1 });
        });

        tools.forEach(tool => {
            const existing = studentSkills.tools.find(t => t.name === tool);
            if (existing) existing.frequency += 1;
            else studentSkills.tools.push({ name: tool, frequency: 1 });
        });

        studentSkills.overallSkillScore = Math.min(100,
            studentSkills.technicalSkills.length * 10 +
            studentSkills.softSkills.length * 8 +
            studentSkills.tools.length * 6
        );

        studentSkills.lastUpdated = new Date();
        await studentSkills.save();

        res.json({ success: true, message: 'Activity submitted successfully', activityId: activity._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getMyActivities = async (req, res) => {     // for portfolio , activity gets updated
    try {
        const activities = await Activity.find({ student: req.user.userId })
            .populate('reviewedBy', 'name')
            .sort({ submittedAt: -1 });

        res.json({ success: true, activities });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.approveActivity = async (req, res) => {         //this will done by faculty
    try {
        const { comment } = req.body;
        const activityId = req.params.id;

        const activity = await Activity.findByIdAndUpdate(
            activityId,
            {
                status: 'approved',
                reviewedBy: req.user.userId,
                facultyComment: comment || '',
                reviewedAt: new Date()
            }, { new: true }
        ).populate('student', 'name');

        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        res.json({ success: true, message: 'Activity approved', activityId: activity._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.rejectActivity = async (req, res) => {   // faculty
    try {
        const { reason } = req.body;
        const activityId = req.params.id;

        const activity = await Activity.findByIdAndUpdate(
            activityId,
            {
                status: 'rejected',
                rejectionReason: reason,
                reviewedBy: req.user.userId,
                reviewedAt: new Date()
            }, { new: true });

        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        res.json({
            success: true, message: 'Activity rejected'
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getFacultyPendingActivities = async (req, res) => {   // get pending activities
    try {
        const activities = await Activity.find({ status: 'pending' })
            .populate('student', 'name rollNumber department')
            .sort({ submittedAt: -1 });

        res.json({ success: true, count: activities.length, activities });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllActivitiesAdmin = async (req, res) => {           // all activites admin
    try {
        const activities = await Activity.find()
            .populate('student', 'name rollNumber department email')
            .populate('reviewedBy', 'name email')
            .sort({ submittedAt: -1 })

        res.json({ success: true, count: activities.length, activities });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getApprovedActivitiesAdmin = async (req, res) => {          // approved by admin
    try {
        const activities = await Activity.find({ status: 'approved' })
            .populate('student', 'name rollNumber department email')
            .populate('reviewedBy', 'name email')
            .sort({ reviewedAt: -1 });

        res.json({
            success: true,
            count: activities.length,
            activities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};