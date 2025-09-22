// Update user language
exports.updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: 'Language is required' });
    req.user.language = language;
    await req.user.save();
    res.json({ message: 'Language updated', language });
  } catch (err) {
    res.status(500).json({ message: 'Language update error', error: err.message });
  }
};
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, language, caregiverNumber } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role, language, caregiverNumber });
    res.status(201).json({ message: 'Registered', user: { id: user._id, name, email, role, language } });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language } });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.profile = async (req, res) => {
  res.json({ user: req.user });
};
