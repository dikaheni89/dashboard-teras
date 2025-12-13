import packageJson from '../../package.json';

// Next.js will replace process..env.customKey with 'my-value' at build time.
// Trying to destructure process..env variables won't work due to the nature of webpack
// ref: https://nextjs.org/docs/pages/api-reference/next-config-js/env

export const APP_VERSION = packageJson.version;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || ''
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || ''
export const APP_OWNER = process.env.NEXT_PUBLIC_APP_OWNER || ''
export const APP_OWNER_URL = process.env.NEXT_PUBLIC_APP_OWNER_URL
export const APP_BASE_PATH = process.env.NEXT_PUBLIC_APP_BASE_PATH?.replace(/\/$/, '') || '';

// SSO public constants for client-side usage
export const NEXT_PUBLIC_SSO_LOGIN_URL =
  process.env.NEXT_PUBLIC_SSO_LOGIN_URL || 'https://pintu-umah.bantenprov.go.id';
export const NEXT_PUBLIC_SSO_RESTRICTION_URL =
  process.env.NEXT_PUBLIC_SSO_RESTRICTION_URL || 'https://pintu-umah.bantenprov.go.id/notif/restriction/=1';
