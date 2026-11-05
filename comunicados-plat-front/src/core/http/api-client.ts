import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthApiResponseDto } from '../../features/auth/infrastructure/dtos/auth-api.dto';
import { AuthMapper } from '../../features/auth/infrastructure/mappers/auth.mapper';
import { useAuthStore } from '../store/use-auth-store';
import { HttpError } from './http-error';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string | string[]; code?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status ?? 500;
    const requestUrl = originalRequest?.url ?? '';

    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<AuthApiResponseDto>(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true },
            )
            .then(({ data }) => {
              const session = AuthMapper.toDomain(data);
              useAuthStore.getState().setSession(session.accessToken, session.user);
              return session.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearSession();
      }
    }

    const rawMessage = error.response?.data?.message;
    const normalizedMessage = Array.isArray(rawMessage)
      ? rawMessage.join('. ')
      : (rawMessage ?? error.message ?? 'Error inesperado de conexión con el servidor.');
    const code = error.response?.data?.code;

    return Promise.reject(new HttpError(status, normalizedMessage, code, error.response?.data));
  },
);
