const Appointment = require('../models/Appointment');
const User = require('../models/User');
// const agoraService = require('../services/agoraService');
// const twilioVideoService = require('../services/twilioVideoService');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, time } = req.body;
    // Check doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') return res.status(400).json({ message: 'Invalid doctor' });
    // Check for conflicts
    const conflict = await Appointment.findOne({ doctorId, time, status: { $in: ['pending', 'confirmed'] } });
    if (conflict) return res.status(409).json({ message: 'Doctor not available at this time' });
    const appt = await Appointment.create({ patientId: req.user._id, doctorId, time });
    res.status(201).json({ message: 'Appointment booked', appointment: appt });
  } catch (err) {
    res.status(500).json({ message: 'Booking error', error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  const filter = req.user.role === 'Doctor' ? { doctorId: req.user._id } : { patientId: req.user._id };
  const appts = await Appointment.find(filter).populate('doctorId patientId');
  res.json(appts);
};

exports.confirmAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  appt.status = 'confirmed';
  await appt.save();
  res.json({ message: 'Appointment confirmed' });
};

exports.createVideoSession = async (req, res) => {
  const { appointmentId } = req.body;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  // Placeholder: generate video session ID (use Agora/Twilio in production)
  appt.videoSessionId = `session_${Date.now()}`;
  await appt.save();
  res.json({ message: 'Video session created', videoSessionId: appt.videoSessionId });
};
