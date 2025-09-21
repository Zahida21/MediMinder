const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const labReportController = require('../controllers/labReportController');

router.post('/upload', auth, labReportController.uploadMiddleware, labReportController.uploadLabReport);
router.get('/', auth, labReportController.getLabReports);

module.exports = router;
