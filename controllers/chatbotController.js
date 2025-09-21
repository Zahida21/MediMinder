const chatbotService = require('../services/chatbotService');


exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const language = req.user?.language || 'en';
    const reply = await chatbotService.askChatbot(message, language);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: 'Chatbot error', error: err.message });
  }
};

// Debug: List available Gemini models
exports.listModels = async (req, res) => {
  try {
    const models = await chatbotService.listGeminiModels();
    res.json({ models });
  } catch (err) {
    res.status(500).json({ message: 'Model list error', error: err.message });
  }
};
