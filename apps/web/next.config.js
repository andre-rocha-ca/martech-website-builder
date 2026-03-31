/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3-alpha.figma.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Enable server actions for webhook processing
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Standalone output for Amplify SSR deployment
  output: "standalone",

  // Production optimizations
  poweredByHeader: false,

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.segment.com; connect-src 'self' https://api.segment.io https://cdn.segment.com https://api.figma.com https://api.openai.com; img-src 'self' data: https://figma-alpha-api.s3.us-west-2.amazonaws.com https://s3-alpha.figma.com https://images.unsplash.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
