import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, ApiError } from '../types';
import { authApi } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const createHttpClient = (getToken: () => string | null, onLogout: () => void) => {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(client(originalRequest));
              },
              reject: (err?: Error) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const tokens = await authApi.refreshToken();
          processQueue(null, tokens.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          onLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const getBaseUrl = () => API_URL;
