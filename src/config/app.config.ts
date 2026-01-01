/**
 * Application configuration
 * Centralized config for environment variables and app settings
 */

import { Platform } from 'react-native';

/**
 * Get the appropriate API base URL based on environment
 * For mobile development, use your computer's local IP address
 *
 * To find your local IP:
 * - Mac/Linux: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
 * - Windows: Run `ipconfig` and look for IPv4 Address
 *
 * Then set EXPO_PUBLIC_API_ENDPOINT in your .env file:
 * EXPO_PUBLIC_API_ENDPOINT=http://YOUR_LOCAL_IP:4000
 */
const getApiBaseUrl = (): string => {
  let url: string;

  // Use environment variable if set
  if (process.env.EXPO_PUBLIC_API_ENDPOINT) {
    url = process.env.EXPO_PUBLIC_API_ENDPOINT;
  } else {
    // Production default
    url = 'https://api.joybormi.uz';
  }

  console.warn(
    `🌐 [API Config] Using base URL: ${url} (Platform: ${Platform.OS})`,
  );

  return url;
};

export const appConfig = {
  // API Configuration
  api: {
    baseURL: getApiBaseUrl(),
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
