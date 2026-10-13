/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === '1';

const nextConfig = {
  ...(isPages ? { output: 'export', basePath: '/Nasher', images: { unoptimized: true } } : {}),
};

export default nextConfig;
