/**
 * Axios API client with interceptors for request/response handling
 * Handles authentication, error transformation, and logging
 */

import { appConfig } from '@/config/app.config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiError,
  ApiErrorResponse,
  ApiResponse,
  PaginatedApiResponse,
} from './types';

/**
 * Create axios instance with default configuration
 */
const createAgentClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: appConfig.api.baseUrl,
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
      // const token = SecureStore.getItem('auth_token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

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
    (response) => {
      console.warn('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });

      return response;
    },
    (error: AxiosError<ApiErrorResponse>) => {
      console.error('[API Response Error]', {
        status: error.response?.status,
        url: error.config?.url,
        error: error.response?.data,
      });

      // Transform axios error to ApiError
      if (error.response?.data) {
        return Promise.reject(new ApiError(error.response.data));
      }

      // Network or timeout error
      const networkError: ApiErrorResponse = {
        success: false,
        error: {
          message: error.message || 'Network error occurred',
          code: 'NETWORK_ERROR',
          statusCode: 0,
        },
      };

      return Promise.reject(new ApiError(networkError));
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
  ): Promise<PaginatedApiResponse<T>> => {
    return agentClass
      .get<PaginatedApiResponse<T>>(url, config)
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
