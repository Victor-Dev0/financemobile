// Tipos espelhados da API .NET

export enum AccountType {
  Checking = 1,
  Savings = 2,
  CreditCard = 3,
  Cash = 4,
}

export enum EntryType {
  Income = 1,
  Expense = 2,
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Contas
export interface RawAccount {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  accountType: AccountType;
  initialBalance: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  initialBalance: number;
}

export interface UpdateAccountRequest {
  name: string;
  type: AccountType;
  initialBalance: number;
}

// Categorias
export interface RawCategory {
  id: string;
  name: string;
  entryType: EntryType;
  icon: string;
  color: string;
  isDefault: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  entryType: EntryType;
  icon: string;
  color: string;
  isDefault: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  entryType: EntryType;
  icon: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name: string;
  icon: string;
  color: string;
}

// Transações
export interface RawTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  entryType: EntryType;
  categoryId: string;
  accountId: string;
  category?: RawCategory;
  account?: RawAccount;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  entryType: EntryType;
  categoryId: string;
  accountId: string;
  category?: Category;
  account?: Account;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  date: string;
  entryType: EntryType;
  categoryId: string;
  accountId: string;
}

export interface UpdateTransactionRequest {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
}

export interface TransactionsQuery {
  from?: string;
  to?: string;
  categoryId?: string;
  accountId?: string;
  type?: EntryType;
  page?: number;
  pageSize?: number;
}

// Paginação
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Relatórios
export interface SummaryReport {
  balance: number;
  income: number;
  expenses: number;
  net: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface CashFlowItem {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  balance: number;
}

// Erro padrão da API
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
