/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow images served by media-service / the gateway. Add your real
    // production domain (and S3/CDN host once you migrate media-service)
    // before deploying.
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080' },
      { protocol: 'http', hostname: 'localhost', port: '5003' },
    ],
  },
};

module.exports = nextConfig;
