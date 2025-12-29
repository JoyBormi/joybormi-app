/**
 * Auth feature types
 */

export interface LoginCredentials {
  method: 'email' | 'phone';
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  method: 'email' | 'phone';
  identifier: string;
  password: string;
  username: string;
}

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'guest' | 'user' | 'worker' | 'creator';
    phone?: string;
    avatar?: string;
  };
  token: string;
};
