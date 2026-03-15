
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateCertificate, verifyCertificate, getStats, downloadCertificate } =
  require('../controllers/certificate.controller');

// by admin
router.post('/generate/:activityId', authMiddleware, generateCertificate);

// Download cert by student
router.get('/download/:certificateId', authMiddleware, downloadCertificate);

router.get('/verify/:certificateId', verifyCertificate);

router.get('/stats', authMiddleware, getStats);

module.exports = router;