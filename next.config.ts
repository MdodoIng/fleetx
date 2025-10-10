import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  experimental: {
    viewTransition: true,
  },
  env: {
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    API_GATEWAY_BASE_URL: process.env.API_GATEWAY_BASE_URL,

    B2C_BASE_URL: process.env.B2C_BASE_URL,
    AWS_API_GATEWAY_BASE_URL: process.env.AWS_API_GATEWAY_BASE_URL,
    GOOGLE_KEY: process.env.GOOGLE_KEY,
    PRODUCTION: process.env.PRODUCTION,
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
    GOOGLE_TAG_MANAGER: process.env.GOOGLE_TAG_MANAGER,
    SURVEY_URL: process.env.SURVEY_URL,
    FRESHCHAT_TOKEN: process.env.FRESHCHAT_TOKEN,
    REFRESH_TOKEN_TIME_IN_MINUTE: process.env.REFRESH_TOKEN_TIME_IN_MINUTE,
    WSS_ENDPOINT: process.env.WSS_ENDPOINT,
    APP_WSS_ENDPOINT: process.env.APP_WSS_ENDPOINT,
    COUNTRY: process.env.COUNTRY,
    LOCAL_ADDRESS_ENABLED: process.env.LOCAL_ADDRESS_ENABLED,
    ZONE_BUSY_MODE_ENABLED: process.env.ZONE_BUSY_MODE_ENABLED,
    TAX_PERCENTAGE: process.env.TAX_PERCENTAGE,
    FRESHCHAT_URL: process.env.FRESHCHAT_URL,
    TRACKING_LINK_ENABLED_VENDORS: process.env.TRACKING_LINK_ENABLED_VENDORS,
    REGIONS: process.env.REGIONS,
  },
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin('./locales/request.ts');
export default withNextIntl(nextConfig);
