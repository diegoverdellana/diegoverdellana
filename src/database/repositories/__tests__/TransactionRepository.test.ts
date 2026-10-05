import type { Database, RunResult } from '../../types';
import type { TransactionType } from '../../../types/transaction';
import { getTodayRange } from '../../../utils/dates';
import { TransactionRepository } from '../TransactionRepository';

interface StoredRow { id: number; type: TransactionType; amount: number; category: string | null; description: string | null; transaction_date: string; created_at: string; updated_at: string }

class MemoryDatabase implements Database {
  readonly rows: StoredRow[] = [];
  async execAsync(): Promise<void> {}
  async runAsync(source: string, ...params: (string | number | null)[]): Promise<RunResult> {
    if (source.includes('INSERT INTO transactions')) {
      const [type, amount, category, description, transactionDate, createdAt, updatedAt] = params;
      const id = this.rows.length + 1;
      this.rows.push({ id, type: type as TransactionType, amount: amount as number, category: category as string | null, description: description as string | null, transaction_date: transactionDate as string, created_at: createdAt as string, updated_at: updatedAt as string });
      return { lastInsertRowId: id, changes: 1 };
    }
    if (source.includes('DELETE FROM transactions')) { const index = this.rows.findIndex(({ id }) => id === params[0]); if (index >= 0) this.rows.splice(index, 1); return { lastInsertRowId: 0, changes: index >= 0 ? 1 : 0 }; }
    return { lastInsertRowId: 0, changes: 0 };
  }
  async getAllAsync<T>(source: string, ...params: (string | number | null)[]): Promise<T[]> {
    let result = [...this.rows];
    if (source.includes('transaction_date >= ?')) result = result.filter((row) => row.transaction_date >= String(params[0]) && row.transaction_date < String(params[1]));
    return result.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date)).map((row) => ({ ...row })) as T[];
  }
  async getFirstAsync<T>(source: string, ...params: (string | number | null)[]): Promise<T | null> {
    if (source.includes('SUM(CASE')) {
      const relevant = this.rows.filter((row) => row.transaction_date >= String(params[0]) && row.transaction_date < String(params[1]));
      return { sales: relevant.filter((row) => row.type === 'sale').reduce((sum, row) => sum + row.amount, 0), expenses: relevant.filter((row) => row.type === 'expense').reduce((sum, row) => sum + row.amount, 0) } as T;
    }
    return (this.rows.find(({ id }) => id === params[0]) as T | undefined) ?? null;
  }
}

describe('TransactionRepository', () => {
  test('creates and retrieves separated sales and expenses with daily totals', async () => {
    const db = new MemoryDatabase(); const repository = new TransactionRepository(db); const now = new Date();
    const sale = await repository.createTransaction({ type: 'sale', amount: 100, description: 'Venta', transactionDate: now });
    await repository.createTransaction({ type: 'expense', amount: 30, category: 'Insumos', transactionDate: now });
    expect(sale.id).toBe(1); expect((await repository.getTransactions()).map(({ type }) => type).sort()).toEqual(['expense', 'sale']);
    expect(await repository.getTotalsByPeriod(getTodayRange(now))).toEqual({ sales: 100, expenses: 30, estimatedProfit: 70 });
  });

  test('persists data when a repository is recreated over the same database', async () => {
    const db = new MemoryDatabase(); const date = new Date();
    await new TransactionRepository(db).createTransaction({ type: 'sale', amount: 100, transactionDate: date });
    expect(await new TransactionRepository(db).getTotalsByPeriod(getTodayRange(date))).toMatchObject({ sales: 100 });
  });

  test('rejects non-positive amounts and deletes records', async () => {
    const db = new MemoryDatabase(); const repository = new TransactionRepository(db);
    await expect(repository.createTransaction({ type: 'sale', amount: 0, transactionDate: new Date() })).rejects.toThrow('INVALID_AMOUNT');
    const item = await repository.createTransaction({ type: 'sale', amount: 10, transactionDate: new Date() }); await repository.deleteTransaction(item.id);
    expect(await repository.getTransactions()).toHaveLength(0);
  });
});
