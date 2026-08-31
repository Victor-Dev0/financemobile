import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthTokens } from '../types';
import { authApi, setAuthCallbacks } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const TOKENS_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para obter token atual do SecureStore
  const getToken = useCallback(() => {
    // Nota: esta função é síncrona mas o SecureStore é async
    // Vamos guardar o token em memória após hydrate
    return (AuthContext as any)._currentToken || null;
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    (AuthContext as any)._currentToken = null;
  }, []);

  // Configura callbacks uma única vez
  useEffect(() => {
    setAuthCallbacks(getToken, handleLogout);
  }, [getToken, handleLogout]);

  const hydrate = useCallback(async () => {
    try {
      const tokensStr = await SecureStore.getItemAsync(TOKENS_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);

      if (!tokensStr || !userStr) {
        setIsLoading(false);
        return;
      }

      const tokens = JSON.parse(tokensStr) as AuthTokens;
      const loadedUser = JSON.parse(userStr) as User;

      // Verifica se token está expirado
      const now = new Date();
      const expiresAt = new Date(tokens.expiresAt);

      if (expiresAt <= now) {
        // Tenta refresh
        try {
          const newTokens = await authApi.refreshToken();
          await authApi.saveTokens(newTokens);
          setUser(loadedUser);
          setIsAuthenticated(true);
          (AuthContext as any)._currentToken = newTokens.accessToken;
          setIsLoading(false);
          return;
        } catch {
          // Refresh falhou, limpa sessão
          await authApi.clearTokens();
          setIsLoading(false);
          return;
        }
      }

      setUser(loadedUser);
      setIsAuthenticated(true);
      (AuthContext as any)._currentToken = tokens.accessToken;
    } catch (error) {
      console.error('Erro ao hidratar auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    await authApi.saveTokens(response.tokens);
    await authApi.saveUser(response.user);
    setUser(response.user);
    setIsAuthenticated(true);
    (AuthContext as any)._currentToken = response.tokens.accessToken;
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    await authApi.saveTokens(response.tokens);
    await authApi.saveUser(response.user);
    setUser(response.user);
    setIsAuthenticated(true);
    (AuthContext as any)._currentToken = response.tokens.accessToken;
  };

  const logout = async () => {
    await handleLogout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
