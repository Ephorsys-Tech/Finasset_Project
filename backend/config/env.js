/**
 * Backend Environment Configuration
 */

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finasset_wealth',

  // Security & JWT Secrets
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'finasset_access_secret_super_secure_key_change_in_prod',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'finasset_refresh_secret_super_secure_key_change_in_prod',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // Application URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',

  // Cloudinary Image Storage
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Initial Admin Defaults
  ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@finassetwealth.com',
  ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'Finasset@Admin2026!',
  ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL || 'info@finassetwealth.com',
};

export default config;
