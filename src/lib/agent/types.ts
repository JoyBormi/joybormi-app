export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiPaginatedApiResponse<T> {
  code: number;
  message: string;
  data: T;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: number;
    message: string;
    status: number;
    timestamp: string;
  };
  status: number;
  url: string;
}

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: number;
  public readonly timestamp: string;
  public readonly message: string;

  constructor(response: ApiErrorResponse) {
    super(response.error.message);
    this.name = 'ApiError';
    this.status = response.status;
    this.code = response.error.code;
    this.timestamp = response.error.timestamp;
    this.message = response.error.message;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
