const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer to store uploaded files in memory as buffer objects
const storage = multer.memoryStorage();

const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  ...ALLOWED_IMAGE_MIMES
];

const ALLOWED_GENERAL_MIMES = [
  ...ALLOWED_DOCUMENT_MIMES,
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const createFileFilter = (allowedMimes, errorMessage) => (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    return cb(null, true);
  }
  const err = new Error(errorMessage);
  err.status = 400;
  return cb(err, false);
};

// General upload (5MB limit, images & office/PDF documents)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: createFileFilter(
    ALLOWED_GENERAL_MIMES,
    'Format file tidak didukung. Gunakan JPG, PNG, WebP, PDF, DOC/DOCX, atau XLS/XLSX.'
  )
});

// Strict image upload (5MB limit, images only)
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: createFileFilter(
    ALLOWED_IMAGE_MIMES,
    'Format gambar tidak didukung. Hanya menerima JPG, PNG, WebP, atau GIF.'
  )
});

// Document/CV upload (5MB limit, PDF or image)
const uploadDocument = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: createFileFilter(
    ALLOWED_DOCUMENT_MIMES,
    'Format berkas tidak didukung. Hanya menerima file PDF atau gambar (JPG/PNG/WebP).'
  )
});

/**
 * Uploads a file buffer directly to Cloudinary
 * @param {Buffer} fileBuffer - The buffer of the uploaded file
 * @param {string} originalName - Original name of the file for reference
 * @param {string} folder - Cloudinary destination folder
 * @returns {Promise<Object>} - The upload result from Cloudinary
 */
const uploadToCloudinary = (fileBuffer, originalName, folder = 'procurement_documents') => {
  return new Promise((resolve, reject) => {
    // Clean original name to remove extension and replace non-alphanumeric chars
    const cleanedName = originalName
      .split('.')[0]
      .replace(/[^a-zA-Z0-9]/g, '_');

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Automatically detects images, pdfs, raw files, etc.
        public_id: `${cleanedName}-${Date.now()}`, // Generate a unique name
        access_mode: 'public'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadImage,
  uploadDocument,
  uploadToCloudinary
};
