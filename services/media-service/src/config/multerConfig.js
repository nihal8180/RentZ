const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('./cloudinary');

/**
 * Uploads go straight to Cloudinary instead of local disk - Render (and most
 * hosting platforms) wipe the local filesystem on every restart/redeploy,
 * which would silently delete every listing photo. Cloudinary gives us
 * storage that survives restarts, plus free image optimization/CDN
 * delivery, without needing a card on file (unlike AWS S3).
 *
 * Files are namespaced under a 'rentz/listings' folder with a random UUID
 * public_id so two owners uploading a file with the same original name
 * never collide.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rentz/listings',
    public_id: () => uuidv4(),
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
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
