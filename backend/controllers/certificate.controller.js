const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const crypto = require('crypto');
const certificateService = require('../services/certificateService');

// GENERATE CERTIFICATE + RETURN PDF
exports.generateCertificate = async (req, res) => {
    try {
        const { activityId } = req.params;
        const activity = await Activity.findById(activityId)
            .populate('student', 'name email');

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Unique Certificate ID
        const certificateId = `CERT_${Date.now()}`;
        const verificationCode = crypto.randomBytes(10).toString('hex');

        // Generate PDF
        const result = await certificateService.generateCertificate({
            studentName: activity.student.name,
            achievement: activity.title,
            organizingBody: activity.organizingBody,
            eventDate: activity.eventDate,
            achievementLevel: activity.achievementLevel,
            certificateId
        });

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Save in DB (optional but good)
        const certificate = new Certificate({
            certificateId,
            activity: activity._id,
            student: activity.student._id,
            issuedBy: req.user.userId,
            title: activity.title,
            organizingBody: activity.organizingBody,
            achievementLevel: activity.achievementLevel,
            eventDate: activity.eventDate,
            pdfPath: 'generated',
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

        // Send PDF
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

exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({ certificateId })
            .populate('student', 'name rollNumber')
            .populate('activity', 'title category');

        if (!certificate) {
            return res.status(404).json({ verified: false, message: 'Certificate not found' });
        }

        res.json({
            verified: true,
            data: {
                certificateId: certificate.certificateId,
                student: certificate.student.name,
                rollNumber: certificate.student.rollNumber,
                title: certificate.activity.title,
                category: certificate.activity.category,
                issuedAt: certificate.issuedAt,
                status: certificate.status
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CERTIFICATE STATS (ADMIN
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