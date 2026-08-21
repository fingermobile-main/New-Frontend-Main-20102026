const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create subdirectories based on file type
    let dir = uploadDir;
    
    if (file.mimetype.startsWith('image/')) {
      dir = path.join(uploadDir, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      dir = path.join(uploadDir, 'videos');
    } else if (file.mimetype.startsWith('audio/')) {
      dir = path.join(uploadDir, 'audio');
    } else {
      dir = path.join(uploadDir, 'documents');
    }
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi', '.mkv', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}`), false);
  }
};

// Create multer instance with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

module.exports = upload;