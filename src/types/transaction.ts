export type TransactionType = 'sale' | 'expense';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  category?: string;
  description?: string;
  transactionDate: Date;
}

export interface TransactionTotals {
  sales: number;
  expenses: number;
  estimatedProfit: number;
}

export interface DatePeriod {
  start: Date;
  end: Date;
}
