const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const prescriptionController = require('../controllers/prescriptionController');

router.post('/upload', auth, prescriptionController.uploadMiddleware, prescriptionController.uploadPrescription);
router.get('/', auth, prescriptionController.getPrescriptions);

module.exports = router;
