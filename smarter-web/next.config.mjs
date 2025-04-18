/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  generate: {
    fallback: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
