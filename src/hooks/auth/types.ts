/**
 * Auth feature types
 */

import { IUser } from '@/types/user.type';

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

export interface AuthResponse {
  token: string;
  user: IUser;
}
