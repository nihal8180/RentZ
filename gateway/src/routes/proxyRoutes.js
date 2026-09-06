const { createProxyMiddleware } = require('http-proxy-middleware');
const { publicLimiter, ownerLimiter, authLimiter } = require('../middleware/rateLimiters');

// IMPORTANT: Express strips the matched mount prefix (e.g. '/api/locations')
// from req.url before handing the request to a middleware mounted with
// app.use(prefix, middleware). Without correcting for this, the proxy would
// forward requests to the target's root path instead of the real path,
// and every downstream service would 404. pathRewrite here just forces
// the proxy to always use the untouched original URL (path + query string)
// instead of the stripped one Express hands it.
const restoreOriginalPath = (path, req) => req.originalUrl;

function registerProxyRoutes(app) {
  const {
    AUTH_SERVICE_URL,
    LISTING_SERVICE_URL,
    MEDIA_SERVICE_URL,
    LOCATION_SERVICE_URL,
    INQUIRY_SERVICE_URL,
  } = process.env;

  // --- Auth routes ---
  // Tight rate limit on login/signup specifically to slow down credential stuffing
  app.use(
    ['/api/auth/login', '/api/auth/signup'],
    authLimiter,
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );
  app.use(
    '/api/auth',
    ownerLimiter,
    createProxyMiddleware({
      target: AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );

  // --- Listing routes ---
  // Search/detail are public and high-traffic; owner CRUD is authenticated
  app.use(
    ['/api/listings/search', /^\/api\/listings\/[^/]+$/],
    publicLimiter,
    createProxyMiddleware({
      target: LISTING_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );
  app.use(
    '/api/listings',
    ownerLimiter,
    createProxyMiddleware({
      target: LISTING_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );

  // --- Media routes (owner uploads) ---
  app.use(
    '/api/media',
    ownerLimiter,
    createProxyMiddleware({
      target: MEDIA_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );
  // Serve uploaded images through the gateway too, for a single public origin
  app.use(
    '/uploads',
    publicLimiter,
    createProxyMiddleware({
      target: MEDIA_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );

  // --- Location routes (public, used by search filters/autocomplete) ---
  app.use(
    '/api/locations',
    publicLimiter,
    createProxyMiddleware({
      target: LOCATION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );

  // --- Inquiry routes (authenticated, both owner and user) ---
  app.use(
    '/api/inquiries',
    ownerLimiter,
    createProxyMiddleware({
      target: INQUIRY_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: restoreOriginalPath,
    })
  );
}

module.exports = registerProxyRoutes;
