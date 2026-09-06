const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Local disk storage for development. Swap this file's export for an
 * S3 (multer-s3) storage engine when moving to production - the
 * controller and routes don't need to change since they only call
 * upload.array('images') and read req.files.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, or WEBP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // 5MB per file, max 10 files
});

module.exports = upload;
