import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenService } from './tokenService';

const API_BASE_URL = import.meta.env.VITE_ENV_API_BASE_URL;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling token refresh and retries
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle network errors (CORS issues)
    if (!error.response) {
      console.error('Network error or CORS issue:', error.message);
      return Promise.reject(error);
    }

    // Handle 401 errors with token refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await tokenService.refreshTokens();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError);
        if (refreshError.response?.status === 401) {
          tokenService.clearTokens();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Retry mechanism for network errors or 5xx responses
    const shouldRetry =
      !error.response || (error.response.status >= 500 && error.response.status < 600);

    if (shouldRetry) {
      originalRequest._retryCount = originalRequest._retryCount ?? 0;
      const maxRetries = 2;
      const retryDelay = 1000; // 1 second

      if (originalRequest._retryCount < maxRetries) {
        originalRequest._retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export const isOnline = (): boolean => navigator.onLine;

export default api;
