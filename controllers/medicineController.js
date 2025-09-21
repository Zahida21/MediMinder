const Medicine = require('../models/Medicine');
const Bull = require('bull');
const redis = require('../config/redis');
// const fcmService = require('../services/fcmService');
// const twilioService = require('../services/twilioService');

// Reminder queue
const reminderQueue = new Bull('reminder-queue', { redis: { port: redis.options.port, host: redis.options.host } });

exports.createMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, times } = req.body;
    const medicine = await Medicine.create({
      patientId: req.user._id,
      name,
      dosage,
      frequency,
      times,
      statusLog: times.map(t => ({ time: nextDoseDate(t), status: 'scheduled' }))
    });
    // Schedule reminders for each time
    times.forEach(time => {
      scheduleReminder(medicine._id, req.user._id, time);
    });
    res.status(201).json({ message: 'Medicine scheduled', medicine });
  } catch (err) {
    res.status(500).json({ message: 'Error scheduling medicine', error: err.message });
  }
};

exports.getMedicines = async (req, res) => {
  const meds = await Medicine.find({ patientId: req.user._id });
  res.json(meds);
};

exports.confirmIntake = async (req, res) => {
  const { medicineId, time } = req.body;
  const med = await Medicine.findById(medicineId);
  if (!med) return res.status(404).json({ message: 'Medicine not found' });
  const log = med.statusLog.find(l => l.time.toISOString() === time);
  if (log) log.status = 'taken';
  await med.save();
  res.json({ message: 'Intake confirmed' });
};

// Helpers
function nextDoseDate(timeStr) {
  const [h, m] = timeStr.split(':');
  const now = new Date();
  now.setHours(h, m, 0, 0);
  if (now < new Date()) now.setDate(now.getDate() + 1);
  return now;
}

function scheduleReminder(medicineId, patientId, timeStr) {
  // Add job to Bull queue (actual notification logic in worker)
  reminderQueue.add({ medicineId, patientId, timeStr }, { repeat: { cron: cronFromTime(timeStr) } });
}

function cronFromTime(timeStr) {
  const [h, m] = timeStr.split(':');
  return `${m} ${h} * * *`;
}
