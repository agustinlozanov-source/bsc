/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bsc/ui", "@bsc/db", "@bsc/utils", "@bsc/validators"],
};

export default nextConfig;
