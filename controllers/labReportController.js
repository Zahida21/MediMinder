const LabReport = require('../models/LabReport');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

exports.uploadLabReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const labReport = await LabReport.create({
      patientId: req.user._id,
      reportUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id
    });
    res.status(201).json({ message: 'Lab report uploaded', labReport });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
};

exports.getLabReports = async (req, res) => {
  const filter = req.user.role === 'Doctor' ? {} : { patientId: req.user._id };
  const reports = await LabReport.find(filter).populate('uploadedBy patientId');
  res.json(reports);
};
