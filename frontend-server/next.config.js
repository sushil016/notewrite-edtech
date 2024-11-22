/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true,
  },
  compiler: {
    styledComponents: true
  },
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here if needed
    return config;
  },
}

module.exports = nextConfig 