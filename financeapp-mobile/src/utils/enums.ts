// Enums da API
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

// Labels para exibição
export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.Checking]: 'Conta Corrente',
  [AccountType.Savings]: 'Poupança',
  [AccountType.CreditCard]: 'Cartão de Crédito',
  [AccountType.Cash]: 'Dinheiro',
};

export const EntryTypeLabels: Record<EntryType, string> = {
  [EntryType.Income]: 'Receita',
  [EntryType.Expense]: 'Despesa',
};

export const AccountTypeOptions = Object.entries(AccountType)
  .filter(([key]) => isNaN(Number(key)))
  .map(([key, value]) => ({
    label: AccountTypeLabels[value as AccountType],
    value: value as AccountType,
  }));

export const EntryTypeOptions = Object.entries(EntryType)
  .filter(([key]) => isNaN(Number(key)))
  .map(([key, value]) => ({
    label: EntryTypeLabels[value as EntryType],
    value: value as EntryType,
  }));
