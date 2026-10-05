export type AnalyticsEvent =
  | 'app_opened' | 'onboarding_started' | 'onboarding_completed'
  | 'sale_form_opened' | 'sale_created' | 'expense_form_opened' | 'expense_created'
  | 'history_viewed' | 'daily_summary_viewed' | 'weekly_summary_viewed'
  | 'monthly_summary_viewed' | 'price_calculator_opened' | 'price_calculation_created';

export type AnalyticsProperties = Record<string, string | number | boolean>;

export interface Analytics {
  track(eventName: AnalyticsEvent, properties?: AnalyticsProperties): void;
}

class DevelopmentAnalytics implements Analytics {
  track(eventName: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (__DEV__) console.debug('[analytics]', eventName, properties ?? {});
  }
}

class NoopAnalytics implements Analytics {
  track(): void {}
}

export const analytics: Analytics = __DEV__ ? new DevelopmentAnalytics() : new NoopAnalytics();
