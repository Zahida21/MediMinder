const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const medicineController = require('../controllers/medicineController');

router.post('/', auth, medicineController.createMedicine);
router.get('/', auth, medicineController.getMedicines);
router.post('/confirm', auth, medicineController.confirmIntake);

module.exports = router;
