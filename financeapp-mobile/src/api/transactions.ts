import { Transaction, RawTransaction, CreateTransactionRequest, UpdateTransactionRequest, TransactionsQuery, PagedResult } from '../types';
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

const mapRawTransaction = (raw: RawTransaction): Transaction => ({
  ...raw,
  category: raw.category ? { ...raw.category, entryType: raw.category.entryType } : undefined,
  account: raw.account ? { ...raw.account, accountType: raw.account.type } : undefined,
});

export const transactionsApi = {
  getAll: async (query?: TransactionsQuery): Promise<PagedResult<Transaction>> => {
    const client = getClient();
    const params = new URLSearchParams();
    if (query?.from) params.append('from', query.from);
    if (query?.to) params.append('to', query.to);
    if (query?.categoryId) params.append('categoryId', query.categoryId);
    if (query?.accountId) params.append('accountId', query.accountId);
    if (query?.type) params.append('type', query.type.toString());
    if (query?.page) params.append('page', query.page.toString());
    if (query?.pageSize) params.append('pageSize', query.pageSize.toString());

    const response = await client.get<PagedResult<RawTransaction>>(`/api/transactions?${params.toString()}`);
    return {
      ...response.data,
      items: response.data.items.map(mapRawTransaction),
    };
  },

  getById: async (id: string): Promise<Transaction> => {
    const client = getClient();
    const response = await client.get<RawTransaction>(`/api/transactions/${id}`);
    return mapRawTransaction(response.data);
  },

  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const client = getClient();
    const body = {
      description: data.description,
      amount: data.amount,
      date: data.date,
      entryType: data.entryType,
      categoryId: data.categoryId,
      accountId: data.accountId,
    };
    const response = await client.post<RawTransaction>('/api/transactions', body);
    return mapRawTransaction(response.data);
  },

  update: async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
    const client = getClient();
    const body = {
      description: data.description,
      amount: data.amount,
      date: data.date,
      categoryId: data.categoryId,
      accountId: data.accountId,
    };
    const response = await client.put<RawTransaction>(`/api/transactions/${id}`, body);
    return mapRawTransaction(response.data);
  },

  delete: async (id: string): Promise<void> => {
    const client = getClient();
    await client.delete(`/api/transactions/${id}`);
  },
};
