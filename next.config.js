/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brytpkxacsmzbawwiqcr.supabase.co',
        pathname: '/storage/v1/object/public/**/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/free-vector/christmas-banner-with-stars-design_1048-17557.jpg',
      },
    ],
  },
};

module.exports = nextConfig;
