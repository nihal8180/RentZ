// POST /api/media/upload  (auth required, expects multipart field "images")
function uploadImages(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5003}`;

  const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

  return res.status(201).json({ urls });
}

module.exports = { uploadImages };
