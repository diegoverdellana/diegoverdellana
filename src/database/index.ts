import * as SQLite from 'expo-sqlite';

import { migrateDatabase } from './schema/migrations';
import type { Database } from './types';

export const DATABASE_NAME = 'mi-negocio.db';

export async function initializeDatabase(): Promise<Database> {
  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await migrateDatabase(database);
  return database;
}
