import type { Database } from '../types';

const migrations = [
  `CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (type IN ('sale', 'expense')),
    amount REAL NOT NULL CHECK (amount > 0),
    category TEXT,
    description TEXT,
    transaction_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    currency_code TEXT NOT NULL DEFAULT 'PEN',
    currency_symbol TEXT NOT NULL DEFAULT 'S/',
    country_code TEXT NOT NULL DEFAULT 'PE',
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
];

export async function migrateDatabase(db: Database): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY);');
  const applied = await db.getAllAsync<{ version: number }>('SELECT version FROM schema_migrations');
  const versions = new Set(applied.map(({ version }) => version));
  for (const [index, migration] of migrations.entries()) {
    const version = index + 1;
    if (!versions.has(version)) {
      await db.execAsync(`BEGIN IMMEDIATE; ${migration} INSERT INTO schema_migrations(version) VALUES (${version}); COMMIT;`);
    }
  }
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR IGNORE INTO preferences
      (id, currency_code, currency_symbol, country_code, onboarding_completed, created_at, updated_at)
      VALUES (1, 'PEN', 'S/', 'PE', 0, ?, ?)`, now, now,
  );
}
