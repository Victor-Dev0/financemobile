import { Account, RawAccount, CreateAccountRequest, UpdateAccountRequest } from '../types';
import { AxiosInstance } from 'axios';

// Cliente será injetado via função getter para evitar circular dependency
let getHttpClient: () => AxiosInstance | null = () => null;

export const setHttpClientGetter = (getter: () => AxiosInstance | null) => {
  getHttpClient = getter;
};

const getClient = (): AxiosInstance => {
  const client = getHttpClient();
  if (!client) {
    throw new Error('HTTP client not initialized');
  }
  return client;
};

const mapRawAccount = (raw: RawAccount): Account => ({
  ...raw,
  accountType: raw.type, // Traduz type (wire) → accountType (domínio)
});

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    const client = getClient();
    const response = await client.get<RawAccount[]>('/api/accounts');
    return response.data.map(mapRawAccount);
  },

  getById: async (id: string): Promise<Account> => {
    const client = getClient();
    const response = await client.get<RawAccount>(`/api/accounts/${id}`);
    return mapRawAccount(response.data);
  },

  create: async (data: CreateAccountRequest): Promise<Account> => {
    const client = getClient();
    const body = {
      name: data.name,
      type: data.type, // Envia type conforme contrato da API
      initialBalance: data.initialBalance,
    };
    const response = await client.post<RawAccount>('/api/accounts', body);
    return mapRawAccount(response.data);
  },

  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const client = getClient();
    const body = {
      name: data.name,
      type: data.type,
      initialBalance: data.initialBalance,
    };
    const response = await client.put<RawAccount>(`/api/accounts/${id}`, body);
    return mapRawAccount(response.data);
  },

  delete: async (id: string): Promise<void> => {
    const client = getClient();
    await client.delete(`/api/accounts/${id}`);
  },
};
