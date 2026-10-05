export interface RunResult { lastInsertRowId: number; changes: number }

export interface Database {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, ...params: (string | number | null)[]): Promise<RunResult>;
  getAllAsync<T>(source: string, ...params: (string | number | null)[]): Promise<T[]>;
  getFirstAsync<T>(source: string, ...params: (string | number | null)[]): Promise<T | null>;
}
