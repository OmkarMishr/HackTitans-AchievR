
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { generateCertificate, verifyCertificate, getStats, downloadCertificate } =
  require('../controllers/certificate.controller');

// Generate certificate (Admin)
router.post('/generate/:activityId', authMiddleware, generateCertificate);

// Download certificate (Student)
router.get('/download/:certificateId', authMiddleware, downloadCertificate);

// Verify (optional public)
router.get('/verify/:certificateId', verifyCertificate);

// Stats
router.get('/stats', authMiddleware, getStats);

module.exports = router;