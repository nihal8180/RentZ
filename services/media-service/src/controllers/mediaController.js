// POST /api/media/upload  (auth required, expects multipart field "images")
function uploadImages(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // multer-storage-cloudinary sets `.path` to the uploaded image's full
  // Cloudinary URL (despite the name - it's not a local filesystem path)
  const urls = req.files.map((file) => file.path);

  return res.status(201).json({ urls });
}

module.exports = { uploadImages };
