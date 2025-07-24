/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    DOMAIN: process.env.DOMAIN
  }
}

module.exports = nextConfig
