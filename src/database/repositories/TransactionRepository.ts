import type { CreateTransactionInput, DatePeriod, Transaction, TransactionTotals } from '../../types/transaction';
import { calculateEstimatedProfit } from '../../utils/calculations';
import type { Database } from '../types';

interface TransactionRow {
  id: number; type: 'sale' | 'expense'; amount: number; category: string | null;
  description: string | null; transaction_date: string; created_at: string; updated_at: string;
}

const SELECT_COLUMNS = 'id, type, amount, category, description, transaction_date, created_at, updated_at';

function mapRow(row: TransactionRow): Transaction {
  return { id: row.id, type: row.type, amount: row.amount, category: row.category,
    description: row.description, transactionDate: row.transaction_date,
    createdAt: row.created_at, updatedAt: row.updated_at };
}

export class TransactionRepository {
  constructor(private readonly db: Database) {}

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error('INVALID_AMOUNT');
    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO transactions (type, amount, category, description, transaction_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, input.type, input.amount, input.category?.trim() || null,
      input.description?.trim() || null, input.transactionDate.toISOString(), now, now,
    );
    const transaction = await this.db.getFirstAsync<TransactionRow>(
      `SELECT ${SELECT_COLUMNS} FROM transactions WHERE id = ?`, result.lastInsertRowId,
    );
    if (!transaction) throw new Error('TRANSACTION_NOT_FOUND_AFTER_CREATE');
    return mapRow(transaction);
  }

  async getTransactions(): Promise<Transaction[]> {
    const rows = await this.db.getAllAsync<TransactionRow>(`SELECT ${SELECT_COLUMNS} FROM transactions ORDER BY transaction_date DESC, id DESC`);
    return rows.map(mapRow);
  }

  async getTransactionsByPeriod(period: DatePeriod): Promise<Transaction[]> {
    const rows = await this.db.getAllAsync<TransactionRow>(
      `SELECT ${SELECT_COLUMNS} FROM transactions WHERE transaction_date >= ? AND transaction_date < ? ORDER BY transaction_date DESC, id DESC`,
      period.start.toISOString(), period.end.toISOString(),
    );
    return rows.map(mapRow);
  }

  async getTotalsByPeriod(period: DatePeriod): Promise<TransactionTotals> {
    const row = await this.db.getFirstAsync<{ sales: number | null; expenses: number | null; transaction_count: number }>(
      `SELECT SUM(CASE WHEN type = 'sale' THEN amount ELSE 0 END) AS sales,
       SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses,
       COUNT(*) AS transaction_count
       FROM transactions WHERE transaction_date >= ? AND transaction_date < ?`,
      period.start.toISOString(), period.end.toISOString(),
    );
    const sales = row?.sales ?? 0;
    const expenses = row?.expenses ?? 0;
    return { sales, expenses, estimatedProfit: calculateEstimatedProfit(sales, expenses), transactionCount: row?.transaction_count ?? 0 };
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM transactions WHERE id = ?', id);
  }
}
