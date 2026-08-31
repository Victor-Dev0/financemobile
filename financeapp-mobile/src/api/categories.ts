import { Category, RawCategory, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import { AxiosInstance } from 'axios';

let getHttpClient: () => AxiosInstance | null = () => null;

export const setHttpClientGetter = (getter: () => AxiosInstance | null) => {
  getHttpClient = getter;
};

const getClient = (): AxiosInstance => {
  const client = getHttpClient();
  if (!client) throw new Error('HTTP client not initialized');
  return client;
};

// Category não precisa de mapeamento pois entryType já vem correto da API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const client = getClient();
    const response = await client.get<RawCategory[]>('/api/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const client = getClient();
    const response = await client.get<RawCategory>(`/api/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const client = getClient();
    const response = await client.post<RawCategory>('/api/categories', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const client = getClient();
    const response = await client.put<RawCategory>(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const client = getClient();
    await client.delete(`/api/categories/${id}`);
  },
};
