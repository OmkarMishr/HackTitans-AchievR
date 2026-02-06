const express = require('express');
const multer = require('multer');

const { submitActivity, getMyActivities, approveActivity, rejectActivity, getFacultyPendingActivities, getAllActivitiesAdmin, getApprovedActivitiesAdmin } = require('../controllers/activity.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit', upload.single('document'), submitActivity);
router.get('/my-activities', getMyActivities);
router.put('/:id/approve', approveActivity);
router.put('/:id/reject', rejectActivity);

router.get('/faculty/pending', getFacultyPendingActivities);

router.get('/admin/all', getAllActivitiesAdmin);
router.get('/admin/approved', getApprovedActivitiesAdmin);

module.exports = router;