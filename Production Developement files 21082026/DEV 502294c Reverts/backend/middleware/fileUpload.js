const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads'
    cb(null, uploadDir)
  },
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|mp4|mp3|wav/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images, documents, audio, and video files are allowed.'));
  }
};

// Configure multer
const upload = multer({
storage: storage,
limits: {
fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
files: parseInt(process.env.MAX_FILES) || 5
  },
fileFilter: fileFilter
})

/**
 * File Upload Middleware
 * Handles single file upload
 */
function uploadSingle(fieldName) {
  return upload.single(fieldName)
}

/**
 * File Upload Middleware
 * Handles multiple file uploads
 */
function uploadMultiple(fieldName, maxCount = 5) {
  return upload.array(fieldName, maxCount)
}

/**
 * File Upload Middleware
 * Handles multiple fields with different file types
 */
function uploadFields(fields) {
  return upload.fields(fields)
}

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  upload
};
