/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Axios API client with interceptors for request/response handling
 * Handles authentication, error transformation, and logging
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { appConfig } from '@/config/app.config';

import { storage } from '../mmkv';

import { ApiError, ApiPaginatedApiResponse } from './types';

/**
 * Create axios instance with default configuration
 */
const createAgentClient = (): AxiosInstance => {
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
      const token = storage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = String(token);
      }
      // Add language if available
      const lang = storage.getItem('language');
      if (lang) {
        config.headers['x-language'] = lang;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - Transform responses and handle errors
  client.interceptors.response.use(
    (res) => {
      return res;
    },
    (error: AxiosError<any>) => {
      // If someone already threw ApiError, just pass it through
      if (error instanceof ApiError) {
        throw error;
      }

      const response = error.response;
      const data = response?.data;

      // Server responded with something
      if (response) {
        // Backend sends flat error format: { code, message, status, timestamp }
        if (data?.message) {
          const apiError = new ApiError({
            error: {
              code: data.code,
              message: data.message,
              status: data.status ?? response.status,
              timestamp: data.timestamp ?? new Date().toISOString(),
            },
            status: response.status,
            url: error.config?.url ?? '',
          });

          throw apiError;
        }

        // Fallback: use HTTP status text
        const fallbackError = new ApiError({
          error: {
            code: 0,
            message: data?.message || response.statusText || 'Request failed',
            status: response.status,
            timestamp: new Date().toISOString(),
          },
          status: response.status,
          url: error.config?.url ?? '',
        });

        throw fallbackError;
      }

      // No response at all => true network error
      const networkError = new ApiError({
        error: {
          code: 0,
          message: 'Network error - Please check your connection',
          status: 0,
          timestamp: new Date().toISOString(),
        },
        status: 0,
        url: error.config?.url ?? '',
      });

      throw networkError;
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
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    agentClass.get<T>(url, config).then((res) => res.data),

  /**
   * GET request with pagination
   */
  getPaginated: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiPaginatedApiResponse<T>> =>
    agentClass
      .get<ApiPaginatedApiResponse<T>>(url, config)
      .then((res) => res.data),

  /**
   * POST request
   */
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    agentClass.post<T>(url, data, config).then((res) => res.data),

  /**
   * PUT request
   */
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> => agentClass.put<T>(url, data, config).then((res) => res.data),

  /**
   * PATCH request
   */
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    agentClass.patch<T>(url, data, config).then((res) => res.data),

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    agentClass.delete<T>(url, config).then((res) => res.data),
};
