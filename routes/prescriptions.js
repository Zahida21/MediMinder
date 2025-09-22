const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const prescriptionController = require('../controllers/prescriptionController');


router.post('/upload', auth, prescriptionController.uploadMiddleware, prescriptionController.uploadPrescription);
router.get('/', auth, prescriptionController.getPrescriptions);
// Download/view prescription file by id
router.get('/file/:id', auth, prescriptionController.getPrescriptionFile);

module.exports = router;
