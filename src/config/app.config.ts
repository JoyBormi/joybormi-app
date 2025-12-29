/**
 * Application configuration
 * Centralized config for environment variables and app settings
 */

export const appConfig = {
  // API Configuration
  api: {
    baseURL: process.env.EXPO_PUBLIC_API_ENDPOINT || 'https://api.joybormi.com',
    timeout: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000, // 30 seconds
  },

  // App Information
  app: {
    name: 'JoyBormi',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    enableAnalytics: true,
    enablePushNotifications: true,
  },
} as const;
