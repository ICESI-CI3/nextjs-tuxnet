/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ correct for Vercel
  reactStrictMode: true,
  basePath: '', // ❌ don’t add custom paths unless really needed
  assetPrefix: '', // ❌ leave empty for Vercel
};

module.exports = nextConfig;
