const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);
// Update language
router.patch('/language', auth, authController.updateLanguage);

module.exports = router;
