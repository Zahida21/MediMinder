const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema({
  time: Date,
  status: { type: String, enum: ['scheduled', 'taken', 'missed'], default: 'scheduled' }
}, { _id: false });

const medicineSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: Number, required: true }, // times per day
  times: [{ type: String, required: true }], // e.g. ['08:00', '14:00', '20:00']
  statusLog: [statusLogSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);
