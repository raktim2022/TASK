/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure React strict mode is enabled for better development experience
  reactStrictMode: true,
  
  // Allow images from external domains
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp'],
  },

  // Configure Webpack to handle SVG files
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;