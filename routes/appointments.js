const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const appointmentController = require('../controllers/appointmentController');

router.post('/book', auth, appointmentController.bookAppointment);
router.get('/', auth, appointmentController.getAppointments);
router.post('/confirm', auth, appointmentController.confirmAppointment);
router.post('/video', auth, appointmentController.createVideoSession);

module.exports = router;
