/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@': path.resolve(__dirname),
        '@/components': path.resolve(__dirname, 'components'),
        [`''components/ui/card''`]: path.resolve(__dirname, 'components/ui/card.js'),
        [`''components/ui/card'' (see below for file content)`]: path.resolve(__dirname, 'components/ui/card.js'),
        '@/components/ui/card': path.resolve(__dirname, 'components/ui/card.js')
      }
    };
    return config;
  }
};

module.exports = nextConfig;
