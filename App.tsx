import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { initializeDatabase } from './src/database';
import { TransactionRepository } from './src/database/repositories/TransactionRepository';
import { CalculatorScreen } from './src/features/calculator/CalculatorScreen';
import { DashboardScreen } from './src/features/dashboard/DashboardScreen';
import { TransactionFormScreen } from './src/features/transactions/TransactionFormScreen';
import { colors } from './src/theme';
import type { CreateTransactionInput, TransactionTotals } from './src/types/transaction';
import { getTodayRange } from './src/utils/dates';

type ScreenName = 'dashboard' | 'sale' | 'expense' | 'calculator';
const emptyTotals: TransactionTotals = { sales: 0, expenses: 0, estimatedProfit: 0 };

export default function App() {
  const repository = useRef<TransactionRepository | null>(null); const [screen, setScreen] = useState<ScreenName>('dashboard');
  const [totals, setTotals] = useState(emptyTotals); const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { if (repository.current) setTotals(await repository.current.getTotalsByPeriod(getTodayRange())); }, []);
  useEffect(() => { void (async () => { try { repository.current = new TransactionRepository(await initializeDatabase()); await refresh(); } catch (error) { if (__DEV__) console.error(error); Alert.alert('No pudimos iniciar la aplicación', 'Ciérrala e inténtalo nuevamente.'); } finally { setLoading(false); } })(); }, [refresh]);
  const save = async (input: CreateTransactionInput) => {
    try { if (!repository.current) throw new Error('DATABASE_NOT_READY'); await repository.current.createTransaction(input); await refresh(); Alert.alert('Movimiento guardado', input.type === 'sale' ? 'Tu venta fue registrada.' : 'Tu gasto fue registrado.'); setScreen('dashboard'); }
    catch (error) { if (__DEV__) console.error(error); Alert.alert('No pudimos guardar el movimiento', 'Inténtalo nuevamente.'); }
  };
  let content;
  if (loading) content = <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /><Text>Preparando Mi Negocio…</Text></SafeAreaView>;
  else if (screen === 'sale' || screen === 'expense') content = <TransactionFormScreen type={screen} onSave={save} onBack={() => setScreen('dashboard')} />;
  else if (screen === 'calculator') content = <CalculatorScreen onBack={() => setScreen('dashboard')} />;
  else content = <DashboardScreen totals={totals} onAddSale={() => setScreen('sale')} onAddExpense={() => setScreen('expense')} onOpenCalculator={() => setScreen('calculator')} />;
  return <SafeAreaView style={styles.root}><StatusBar style="dark" />{content}</SafeAreaView>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.background } });
