/**
 * Axios API client with interceptors for request/response handling
 * Handles authentication, error transformation, and logging
 */

import { appConfig } from '@/config/app.config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '../mmkv';
import { ApiError, ApiPaginatedApiResponse, ApiResponse } from './types';

/**
 * Create axios instance with default configuration
 */
const createAgentClient = (): AxiosInstance => {
  console.log(`LOGGING 👀:`, appConfig.api.baseURL);
  const client = axios.create({
    baseURL: appConfig.api.baseURL,
    timeout: appConfig.api.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token and logging
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      // TODO: Get token from secure storage
      const token = storage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.warn('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      });

      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    },
  );

  // Response interceptor - Transform responses and handle errors
  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError<any>) => {
      const data = error.response?.data;

      // Case 1: { error: {...} }
      if (data?.error) {
        throw new ApiError({
          error: data.error,
          status: error.response?.status ?? data.error.status,
          url: error.config?.url ?? '',
        });
      }

      // Case 2: { code, message, status, timestamp }
      if (data?.code && data?.message) {
        throw new ApiError({
          error: {
            code: data.code,
            message: data.message,
            status: data.status ?? error.response?.status ?? 0,
            timestamp: data.timestamp ?? new Date().toISOString(),
          },
          status: error.response?.status ?? 0,
          url: error.config?.url ?? '',
        });
      }

      // True network error
      throw new ApiError({
        error: {
          code: 0,
          message: 'Network error',
          status: 0,
          timestamp: new Date().toISOString(),
        },
        status: 0,
        url: error.config?.url ?? '',
      });
    },
  );

  return client;
};

/**
 * Global API client instance
 */
export const agentClass = createAgentClient();

/**
 * API agent with typed methods for common HTTP operations
 */
export const agent = {
  /**
   * GET request
   */
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return agentClass.get<ApiResponse<T>>(url, config).then((res) => res.data);
  },

  /**
   * GET request with pagination
   */
  getPaginated: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiPaginatedApiResponse<T>> => {
    return agentClass
      .get<ApiPaginatedApiResponse<T>>(url, config)
      .then((res) => res.data);
  },

  /**
   * POST request
   */
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return agentClass
      .post<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * PUT request
   */
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return agentClass
      .put<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * PATCH request
   */
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return agentClass
      .patch<ApiResponse<T>>(url, data, config)
      .then((res) => res.data);
  },

  /**
   * DELETE request
   */
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    return agentClass
      .delete<ApiResponse<T>>(url, config)
      .then((res) => res.data);
  },
};
