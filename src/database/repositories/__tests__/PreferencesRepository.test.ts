import type { Database, RunResult } from '../../types';
import { PreferencesRepository } from '../PreferencesRepository';

class PreferencesDatabase implements Database {
  completed = 0;
  async execAsync(): Promise<void> {}
  async runAsync(source: string): Promise<RunResult> { if (source.includes('onboarding_completed = 1')) this.completed = 1; return { lastInsertRowId: 0, changes: 1 }; }
  async getAllAsync<T>(): Promise<T[]> { return []; }
  async getFirstAsync<T>(): Promise<T> { return { id: 1, currency_code: 'PEN', currency_symbol: 'S/', country_code: 'PE', onboarding_completed: this.completed, created_at: 'created', updated_at: 'updated' } as T; }
}

describe('PreferencesRepository', () => {
  test('persists onboarding completion', async () => {
    const database = new PreferencesDatabase(); const repository = new PreferencesRepository(database);
    expect((await repository.getPreferences()).onboardingCompleted).toBe(false);
    await repository.completeOnboarding();
    expect((await repository.getPreferences()).onboardingCompleted).toBe(true);
  });
});
