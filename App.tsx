import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { analytics } from './src/analytics';
import { BottomNavigation } from './src/components/BottomNavigation';
import { Toast } from './src/components/Toast';
import { initializeDatabase } from './src/database';
import { PreferencesRepository } from './src/database/repositories/PreferencesRepository';
import { TransactionRepository } from './src/database/repositories/TransactionRepository';
import { CalculatorScreen } from './src/features/calculator/CalculatorScreen';
import { DashboardScreen } from './src/features/dashboard/DashboardScreen';
import { HistoryScreen } from './src/features/history/HistoryScreen';
import { OnboardingScreen } from './src/features/onboarding/OnboardingScreen';
import { SettingsScreen } from './src/features/settings/SettingsScreen';
import { TransactionFormScreen } from './src/features/transactions/TransactionFormScreen';
import { colors } from './src/theme';
import type { AppRoute, HistoryPeriodKey, PeriodKey, RootTab } from './src/types/navigation';
import type { Preferences } from './src/types/preferences';
import type { CreateTransactionInput, Transaction, TransactionTotals } from './src/types/transaction';
import { getPeriodRange } from './src/utils/dates';

const emptyTotals: TransactionTotals = { sales: 0, expenses: 0, estimatedProfit: 0, transactionCount: 0 };
const defaultPreferences: Preferences = { id: 1, currencyCode: 'PEN', currencySymbol: 'S/', countryCode: 'PE', onboardingCompleted: false, createdAt: '', updatedAt: '' };

export default function App() {
  const repository = useRef<TransactionRepository | null>(null); const preferencesRepository = useRef<PreferencesRepository | null>(null);
  const [route, setRoute] = useState<AppRoute>('home'); const [period, setPeriod] = useState<PeriodKey>('today'); const [historyPeriod, setHistoryPeriod] = useState<HistoryPeriodKey>('all');
  const [totals, setTotals] = useState(emptyTotals); const [transactions, setTransactions] = useState<Transaction[]>([]); const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true); const [onboarding, setOnboarding] = useState(false); const [toast, setToast] = useState<string | null>(null);
  const refresh = useCallback(async () => { if (!repository.current) return; setTotals(await repository.current.getTotalsByPeriod(getPeriodRange(period))); const items = historyPeriod === 'all' ? await repository.current.getTransactions() : await repository.current.getTransactionsByPeriod(getPeriodRange(historyPeriod)); setTransactions(items); }, [historyPeriod, period]);
  useEffect(() => { void (async () => { try { const database = await initializeDatabase(); repository.current = new TransactionRepository(database); preferencesRepository.current = new PreferencesRepository(database); const storedPreferences = await preferencesRepository.current.getPreferences(); setPreferences(storedPreferences); setOnboarding(!storedPreferences.onboardingCompleted); analytics.track('app_opened'); if (!storedPreferences.onboardingCompleted) analytics.track('onboarding_started'); } catch (error) { if (__DEV__) console.error(error); Alert.alert('No pudimos iniciar la aplicación', 'Ciérrala e inténtalo nuevamente.'); } finally { setLoading(false); } })(); }, []);
  useEffect(() => { if (!loading) void refresh(); }, [loading, refresh]);
  useEffect(() => { if (!toast) return; const timeout = setTimeout(() => setToast(null), 2500); return () => clearTimeout(timeout); }, [toast]);
  const selectPeriod = (next: PeriodKey) => { setPeriod(next); analytics.track(next === 'today' ? 'daily_summary_viewed' : next === 'week' ? 'weekly_summary_viewed' : 'monthly_summary_viewed'); };
  const openForm = (type: 'sale' | 'expense') => { setRoute(type); analytics.track(type === 'sale' ? 'sale_form_opened' : 'expense_form_opened'); };
  const selectTab = (tab: RootTab) => { setRoute(tab); if (tab === 'history') analytics.track('history_viewed'); if (tab === 'calculator') analytics.track('price_calculator_opened'); };
  const save = async (input: CreateTransactionInput) => {
    try { if (!repository.current) throw new Error('DATABASE_NOT_READY'); await repository.current.createTransaction(input); await refresh(); setToast(input.type === 'sale' ? 'Venta registrada' : 'Gasto registrado'); analytics.track(input.type === 'sale' ? 'sale_created' : 'expense_created'); setRoute('home'); }
    catch (error) { if (__DEV__) console.error(error); Alert.alert('No pudimos guardar el movimiento', 'Inténtalo nuevamente.'); }
  };
  const completeOnboarding = async () => { try { if (!preferencesRepository.current) throw new Error('DATABASE_NOT_READY'); await preferencesRepository.current.completeOnboarding(); setPreferences((current) => ({ ...current, onboardingCompleted: true })); setOnboarding(false); analytics.track('onboarding_completed'); } catch (error) { if (__DEV__) console.error(error); Alert.alert('No pudimos guardar tu avance', 'Inténtalo nuevamente.'); } };
  let content;
  if (loading) content = <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /><Text>Preparando Mi Negocio…</Text></SafeAreaView>;
  else if (onboarding) content = <OnboardingScreen onComplete={completeOnboarding} />;
  else if (route === 'sale' || route === 'expense') content = <TransactionFormScreen type={route} onSave={save} onBack={() => setRoute('home')} />;
  else if (route === 'history') content = <HistoryScreen transactions={transactions} period={historyPeriod} onPeriodChange={setHistoryPeriod} />;
  else if (route === 'calculator') content = <CalculatorScreen onBack={() => setRoute('home')} onCalculated={() => analytics.track('price_calculation_created')} />;
  else if (route === 'settings') content = <SettingsScreen preferences={preferences} />;
  else content = <DashboardScreen totals={totals} period={period} onPeriodChange={selectPeriod} onAddSale={() => openForm('sale')} onAddExpense={() => openForm('expense')} onOpenCalculator={() => selectTab('calculator')} />;
  const showTabs = !loading && !onboarding && route !== 'sale' && route !== 'expense'; const activeTab: RootTab = route === 'history' || route === 'calculator' || route === 'settings' ? route : 'home';
  return <SafeAreaView style={styles.root}><StatusBar style="dark" />{content}{showTabs && <BottomNavigation active={activeTab} onSelect={selectTab} />}{toast && <Toast message={toast} />}</SafeAreaView>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.background } });
