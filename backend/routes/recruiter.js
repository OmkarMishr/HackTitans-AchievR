const express = require('express');
const router = express.Router();
const { getPortfolio } = require('../controllers/recruiter.controller');

router.get('/profile/:id', getPortfolio);

module.exports = router;