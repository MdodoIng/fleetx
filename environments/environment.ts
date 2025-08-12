export const environment = {
  APP_VERSION: '7.2.0',
  API_GATEWAY_BASE_URL: 'https://kw-ppd-api-services.mashkor.com/v1',
  B2C_BASE_URL: 'https://asia-south1-mashkor-b2c-staging.cloudfunctions.net/',
  AWS_API_GATEWAY_BASE_URL: 'https://kw-ppd-webhook.mashkor.com/api-v1',
  GOOGLE_KEY: 'AIzaSyByDDM-aY7z4IZNCXDxmS8-vF-y1_414hA',
  production: true,
  GOOGLE_ANALYTICS: 'UA-178399976-1',
  GOOGLE_TAG_MANAGER: 'GTM-5FFTKH3',
  SURVEY_URL:
    'https://docs.google.com/forms/d/e/1FAIpQLSesvj9WUuxppWqCivEwFsBGmBHjh0i74V3pKa1WiOuiJiTUnw/viewform?embedded=true',
  FRESHCHAT_TOKEN: '2f011cc7-5a24-4429-aeff-bce1346d900f',
  REFRESH_TOKEN_TIME_IN_MINUTE: 65,
  WSS_ENDPOINT: 'wss://26m01kf3ud.execute-api.eu-central-1.amazonaws.com/pp-ws',
  APP_WSS_ENDPOINT:
    'wss://kjeww1ck07.execute-api.eu-central-1.amazonaws.com/pp-ws',
  COUNTRY: 'kuwait',
  LOCAL_ADDRESS_ENABLED: true,
  ZONE_BUSY_MODE_ENABLED: true,
  REGIONS: [
    {
      domain: 'https://kw-ppd-couriers.mashkor.com',
      country_code: 'KW',
      country: 'kuwait',
    },
    { domain: 'http://localhost:4200', country_code: 'IN', country: 'kuwait' },
  ],
  TAX_PERCENTAGE: 5,
  FRESHCHAT_URL: 'https://wchat.freshchat.com',
  TRACKING_LINK_ENABLED_VENDORS: ['d1e53ad8-ba2a-40f0-bae0-fa69b1c3396d'],
};
