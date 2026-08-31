import { setHttpClientGetter as setAccountsClient } from './accounts';
import { setHttpClientGetter as setCategoriesClient } from './categories';
import { setHttpClientGetter as setTransactionsClient } from './transactions';
import { setHttpClientGetter as setReportsClient } from './reports';
import { createHttpClient } from './http';

let httpClient: any = null;

export const initializeApiClients = (getToken: () => string | null, onLogout: () => void) => {
  if (!httpClient) {
    httpClient = createHttpClient(getToken, onLogout);
  }
  
  // Injeta o cliente em todos os módulos da API
  setAccountsClient(() => httpClient);
  setCategoriesClient(() => httpClient);
  setTransactionsClient(() => httpClient);
  setReportsClient(() => httpClient);
  
  return httpClient;
};

export { accountsApi } from './accounts';
export { categoriesApi } from './categories';
export { transactionsApi } from './transactions';
export { reportsApi } from './reports';
export { authApi } from './auth';
