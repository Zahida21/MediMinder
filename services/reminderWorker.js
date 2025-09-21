const Bull = require('bull');
const Medicine = require('../models/Medicine');
const fcmService = require('./fcmService');
const twilioService = require('./twilioService');
const redis = require('../config/redis');

const reminderQueue = new Bull('reminder-queue', { redis: { port: redis.options.port, host: redis.options.host } });


reminderQueue.process(async (job) => {
  const { medicineId, patientId, timeStr } = job.data;
  // 1. Fetch medicine and patient info
  const med = await Medicine.findById(medicineId).populate('patientId');
  if (!med) return;

  // 2. Send FCM push notification
  await fcmService.sendReminder(med.patientId, med.name, timeStr);

  // 3. Mark missed dose if not confirmed within time window (simulate for now)
  const now = new Date();
  const log = med.statusLog.find(l => l.time.toISOString().slice(0,16) === now.toISOString().slice(0,16));
  if (log && log.status === 'scheduled') {
    // Simulate missed dose (in real app, check after some delay)
    log.status = 'missed';
    await med.save();
    // Count missed doses in last 7 days
    const missed = med.statusLog.filter(l => l.status === 'missed' && new Date(l.time) > new Date(Date.now() - 7*24*60*60*1000)).length;
    if (missed >= 3 && med.patientId.caregiverNumber) {
      await twilioService.sendCaregiverAlert(med.patientId.caregiverNumber, med.name, med.patientId.name);
    }
  }

  console.log(`Reminder sent for medicine ${med.name} to patient ${med.patientId.name} at ${timeStr}`);
});

console.log('Reminder worker started');
