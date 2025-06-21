/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['plus.unsplash.com', 'images.unsplash.com', 'via.placeholder.com'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.unsplash.com',
          },
        ],
    },
    env: {
        SERVER_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    }
};

export default nextConfig;
