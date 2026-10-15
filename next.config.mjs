/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === '1';

const nextConfig = {
  ...(isPages
    ? {
        output: 'export',
        basePath: '/Nasher',
        images: { unoptimized: true },
        env: { NEXT_PUBLIC_STATIC_EXPORT: '1' },
      }
    : {}),
};

export default nextConfig;
