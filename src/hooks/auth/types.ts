/**
 * Auth feature types
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'user' | 'worker' | 'creator';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'guest' | 'user' | 'worker' | 'creator';
    phone?: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}
