import * as SecureStore from 'expo-secure-store';
import { AuthTokens, User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { createHttpClient } from './http';

const TOKENS_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

// Cliente HTTP inicializado com funções placeholder (será atualizado pelo authStore)
let getTokenFn: () => string | null = () => null;
let logoutFn: () => void = () => {};

const client = createHttpClient(getTokenFn, logoutFn);

export const setAuthCallbacks = (getToken: () => string | null, onLogout: () => void) => {
  getTokenFn = getToken;
  logoutFn = onLogout;
};

const mapAuthResponse = (response: AuthResponse): AuthResponse => ({
  user: response.user,
  tokens: response.tokens,
});

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/api/auth/login', data);
    return mapAuthResponse(response.data);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/api/auth/register', data);
    return mapAuthResponse(response.data);
  },

  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = await SecureStore.getItemAsync(TOKENS_KEY).then((val) => {
      if (!val) return null;
      const parsed = JSON.parse(val);
      return parsed.refreshToken;
    });

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await client.post<AuthTokens>('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await client.post('/api/auth/logout');
    } catch {
      // Ignora erro no logout (token pode estar expirado)
    } finally {
      await SecureStore.deleteItemAsync(TOKENS_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  saveTokens: async (tokens: AuthTokens): Promise<void> => {
    await SecureStore.setItemAsync(TOKENS_KEY, JSON.stringify(tokens));
  },

  saveUser: async (user: User): Promise<void> => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  getTokens: async (): Promise<AuthTokens | null> => {
    const tokensStr = await SecureStore.getItemAsync(TOKENS_KEY);
    if (!tokensStr) return null;
    return JSON.parse(tokensStr);
  },

  clearTokens: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKENS_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
