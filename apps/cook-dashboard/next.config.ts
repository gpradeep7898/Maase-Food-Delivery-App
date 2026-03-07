import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@maase/types'],
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

export default nextConfig;
