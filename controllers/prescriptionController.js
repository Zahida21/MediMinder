const Prescription = require('../models/Prescription');
const multer = require('multer');
const path = require('path');

// For demo: store files locally in /uploads (replace with GridFS/S3 in prod)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

exports.uploadPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const prescription = await Prescription.create({
      doctorId: req.user._id,
      patientId,
      fileUrl: `/uploads/${req.file.filename}`
    });
    res.status(201).json({ message: 'Prescription uploaded', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  const filter = req.user.role === 'Doctor' ? { doctorId: req.user._id } : { patientId: req.user._id };
  const prescriptions = await Prescription.find(filter).populate('doctorId patientId');
  res.json(prescriptions);
};
