const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted' });
};

exports.getAppointments = async (req, res) => {
  const appts = await Appointment.find().populate('doctorId patientId');
  res.json(appts);
};

exports.getPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find().populate('doctorId patientId');
  res.json(prescriptions);
};

exports.getMedicineAdherence = async (req, res) => {
  // % of doses taken vs scheduled for all patients
  const medicines = await Medicine.find();
  let total = 0, taken = 0;
  medicines.forEach(med => {
    med.statusLog.forEach(log => {
      total++;
      if (log.status === 'taken') taken++;
    });
  });
  const adherence = total ? ((taken / total) * 100).toFixed(2) : 'N/A';
  res.json({ adherencePercent: adherence });
};

exports.getAppointmentStats = async (req, res) => {
  const total = await Appointment.countDocuments();
  const completed = await Appointment.countDocuments({ status: 'completed' });
  const pending = await Appointment.countDocuments({ status: 'pending' });
  res.json({ total, completed, pending });
};

exports.getDoctorUtilization = async (req, res) => {
  // Appointments per doctor
  const doctors = await User.find({ role: 'Doctor' });
  const stats = {};
  for (const doc of doctors) {
    stats[doc.name] = await Appointment.countDocuments({ doctorId: doc._id });
  }
  res.json(stats);
};
