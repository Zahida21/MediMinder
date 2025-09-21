
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const chatbotController = require('../controllers/chatbotController');

router.post('/ask', auth, chatbotController.chat);

// Debug: List available Gemini models (no auth for easier testing)
router.get('/models', chatbotController.listModels);

module.exports = router;
