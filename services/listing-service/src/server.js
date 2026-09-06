require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const listingRoutes = require('./routes/listingRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ service: 'listing-service', status: 'ok' });
});

app.use('/api/listings', listingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[listing-service] Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`[listing-service] running on port ${PORT}`);
});
