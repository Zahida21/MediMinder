
// ...existing code...
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load env vars
dotenv.config();

const app = express();
app.use(express.json());
// Chatbot route
app.use('/api/chatbot', require('../routes/chatbot'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Prescription routes
app.use('/api/prescriptions', require('../routes/prescriptions'));

// Lab report routes
app.use('/api/labreports', require('../routes/labreports'));

// Security middlewares
app.use(helmet());
app.use(cors());

app.use(morgan('dev'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));




// Auth routes
app.use('/api/auth', require('../routes/auth'));

// Medicine routes
app.use('/api/medicines', require('../routes/medicines'));

// Appointment routes
app.use('/api/appointments', require('../routes/appointments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
