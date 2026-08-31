import { SummaryReport, CategorySummary, CashFlowItem, AccountBalance } from '../types';
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

export const reportsApi = {
  getSummary: async (from?: string, to?: string): Promise<SummaryReport> => {
    const client = getClient();
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await client.get<SummaryReport>(`/api/reports/summary?${params.toString()}`);
    return response.data;
  },

  getByCategory: async (entryType: number, from?: string, to?: string): Promise<CategorySummary[]> => {
    const client = getClient();
    const params = new URLSearchParams();
    params.append('entryType', entryType.toString());
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await client.get<CategorySummary[]>(`/api/reports/by-category?${params.toString()}`);
    return response.data;
  },

  getCashFlow: async (from?: string, to?: string): Promise<CashFlowItem[]> => {
    const client = getClient();
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await client.get<CashFlowItem[]>(`/api/reports/cashflow?${params.toString()}`);
    return response.data;
  },

  getAccountBalances: async (): Promise<AccountBalance[]> => {
    const client = getClient();
    const response = await client.get<AccountBalance[]>('/api/reports/account-balances');
    return response.data;
  },
};
