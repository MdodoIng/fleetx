import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    viewTransition: true,
  },
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin('./locales/request.ts');
export default withNextIntl(nextConfig);
