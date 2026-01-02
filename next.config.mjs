/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
   images: {
    unoptimized: true,
    domains: [
      "upload.wikimedia.org", // for Visa, Mastercard, Amex logos
      "tse2.mm.bing.net"
      // Add any other domains you need here
    ],
  },
}

export default nextConfig
