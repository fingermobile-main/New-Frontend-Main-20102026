const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure root and sub directories exist
const BASE_UPLOAD_DIR = path.resolve(__dirname, '../uploads');
const DIRS = ['audio', 'stems', 'images', 'media', 'documents'];
DIRS.forEach(d => {
  const p = path.join(BASE_UPLOAD_DIR, d);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subDir = 'media';
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (ext === '.fmbw' || ext === '.fma' || file.fieldname.includes('stem')) {
      subDir = 'stems';
    } else if (mime.startsWith('audio/') || ['.flac', '.wav', '.mp3', '.aac', '.m4a', '.ogg'].includes(ext)) {
      subDir = 'audio';
    } else if (mime.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
      subDir = 'images';
    } else if (mime.startsWith('video/') || ['.mp4', '.webm', '.mov'].includes(ext)) {
      subDir = 'media';
    } else {
      subDir = 'documents';
    }

    const targetDir = path.join(BASE_UPLOAD_DIR, subDir);
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const cleanOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${cleanOriginal}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow comprehensive formats for sovereign media, FLAC masters, stems, images, audio, video
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [
    '.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg',
    '.fmbw', '.fma', '.zip', '.tar', '.gz',
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
    '.mp4', '.webm', '.mov', '.pdf', '.json'
  ];

  if (allowedExts.includes(ext) || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext || file.mimetype}`));
  }
};

const consoleUpload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max
    files: 5
  },
  fileFilter
});

module.exports = consoleUpload;
