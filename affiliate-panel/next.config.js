/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: { unoptimized: true },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
