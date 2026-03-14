const express = require('express');
const certificateController = require('../controllers/certificate.controller');

const router = express.Router();

router.get('/:certificateId', certificateController.verifyCertificate);

module.exports = router;