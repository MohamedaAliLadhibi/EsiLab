/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },

      // Product suppliers (EsiLab catalogue)
      { protocol: 'https', hostname: 'www.precisa.com' },
      { protocol: 'https', hostname: 'precisa.com' },
      { protocol: 'https', hostname: '**.precisa.com' },

      { protocol: 'https', hostname: 'www.novabiomedical.com' },
      { protocol: 'https', hostname: 'novabiomedical.com' },
      { protocol: 'https', hostname: '**.novabiomedical.com' },
    ],
  },
};

module.exports = nextConfig;