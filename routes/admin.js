const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const adminController = require('../controllers/adminController');

// Only admin can access these routes
router.use(auth, roles('Admin'));

router.get('/users', adminController.getUsers);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/appointments', adminController.getAppointments);
router.get('/prescriptions', adminController.getPrescriptions);
router.get('/reports/adherence', adminController.getMedicineAdherence);
router.get('/reports/appointments', adminController.getAppointmentStats);
router.get('/reports/doctor-utilization', adminController.getDoctorUtilization);

module.exports = router;
