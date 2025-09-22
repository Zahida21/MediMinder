
const Prescription = require('../models/Prescription');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { getGFS } = require('../services/gridfs');

// GridFS storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: Date.now() + '-' + file.originalname
    };
  }
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
      fileUrl: req.file.id // Store GridFS file id
    });
    res.status(201).json({ message: 'Prescription uploaded', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
};

// Stream prescription file from GridFS
exports.getPrescriptionFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const gfs = getGFS();
    gfs.files.findOne({ _id: require('mongoose').Types.ObjectId(fileId) }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }
      const readstream = gfs.createReadStream({ _id: file._id });
      res.set('Content-Type', file.contentType || 'application/octet-stream');
      readstream.pipe(res);
    });
  } catch (err) {
    res.status(500).json({ message: 'File fetch error', error: err.message });
  }
};

exports.getPrescriptions = async (req, res) => {
  const filter = req.user.role === 'Doctor' ? { doctorId: req.user._id } : { patientId: req.user._id };
  const prescriptions = await Prescription.find(filter).populate('doctorId patientId');
  res.json(prescriptions);
};
