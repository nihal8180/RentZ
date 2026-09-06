require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ service: 'media-service', status: 'ok' });
});

app.use('/api/media', mediaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[media-service] Unhandled error:', err);
  res
    .status(err.message?.includes('Only JPEG') ? 400 : 500)
    .json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`[media-service] running on port ${PORT}`);
});
