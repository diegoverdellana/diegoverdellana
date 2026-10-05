import type { Preferences } from '../../types/preferences';
import type { Database } from '../types';

interface PreferencesRow {
  id: 1;
  currency_code: string;
  currency_symbol: string;
  country_code: string;
  onboarding_completed: number;
  created_at: string;
  updated_at: string;
}

export class PreferencesRepository {
  constructor(private readonly db: Database) {}

  async getPreferences(): Promise<Preferences> {
    const row = await this.db.getFirstAsync<PreferencesRow>(
      `SELECT id, currency_code, currency_symbol, country_code,
       onboarding_completed, created_at, updated_at
       FROM preferences WHERE id = 1`,
    );
    if (!row) throw new Error('PREFERENCES_NOT_FOUND');
    return {
      id: row.id,
      currencyCode: row.currency_code,
      currencySymbol: row.currency_symbol,
      countryCode: row.country_code,
      onboardingCompleted: row.onboarding_completed === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async completeOnboarding(): Promise<void> {
    await this.db.runAsync(
      'UPDATE preferences SET onboarding_completed = 1, updated_at = ? WHERE id = 1',
      new Date().toISOString(),
    );
  }
}
