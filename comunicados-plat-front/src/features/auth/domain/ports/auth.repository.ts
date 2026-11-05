import type { AuthSession } from '../models/auth-user.model';

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  refresh(): Promise<AuthSession>;
  logout(): Promise<void>;
}
