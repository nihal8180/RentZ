require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const registerProxyRoutes = require('./routes/proxyRoutes');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ service: 'gateway', status: 'ok' });
});

// NOTE: no express.json() here on purpose - body parsing happens in each
// downstream service. Parsing the body at the gateway and then proxying
// breaks streaming (especially file uploads to media-service via multer).
registerProxyRoutes(app);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[gateway] running on port ${PORT}`);
  console.log('[gateway] routing:');
  console.log(`  /api/auth       -> ${process.env.AUTH_SERVICE_URL}`);
  console.log(`  /api/listings   -> ${process.env.LISTING_SERVICE_URL}`);
  console.log(`  /api/media      -> ${process.env.MEDIA_SERVICE_URL}`);
  console.log(`  /api/locations  -> ${process.env.LOCATION_SERVICE_URL}`);
  console.log(`  /api/inquiries  -> ${process.env.INQUIRY_SERVICE_URL}`);
});
