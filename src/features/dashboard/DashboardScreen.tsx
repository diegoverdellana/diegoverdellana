import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { MetricCard } from '../../components/MetricCard';
import { PeriodSelector } from '../../components/PeriodSelector';
import { Screen } from '../../components/Screen';
import { colors, spacing } from '../../theme';
import type { TransactionTotals } from '../../types/transaction';
import type { PeriodKey } from '../../types/navigation';

interface Props { totals: TransactionTotals; period: PeriodKey; onPeriodChange: (period: PeriodKey) => void; onAddSale: () => void; onAddExpense: () => void; onOpenCalculator: () => void }
const periods = [{ key: 'today', label: 'Hoy' }, { key: 'week', label: 'Semana' }, { key: 'month', label: 'Mes' }] as const;

export function DashboardScreen({ totals, period, onPeriodChange, onAddSale, onAddExpense, onOpenCalculator }: Props) {
  return <Screen>
    <Text style={styles.brand}>PRODUCT CREATORS</Text><Text style={styles.title}>Mi Negocio</Text><Text style={styles.today}>Hoy</Text>
    <PeriodSelector value={period} options={periods} onChange={onPeriodChange} />
    <View style={styles.metrics}><MetricCard label="Ventas" value={totals.sales} tone="sale" /><MetricCard label="Gastos" value={totals.expenses} tone="expense" /></View><MetricCard label="Ganancia estimada" value={totals.estimatedProfit} />
    <Text style={styles.count}>{totals.transactionCount} {totals.transactionCount === 1 ? 'movimiento' : 'movimientos'}</Text>
    {totals.transactionCount === 0 ? <EmptyState title="Todavía no tienes movimientos." description="Registra tu primera venta o gasto para comenzar." primaryAction={{ label: 'Registrar venta', onPress: onAddSale }} secondaryAction={{ label: 'Registrar gasto', onPress: onAddExpense }} /> : <View style={styles.actions}><Button label="Registrar venta" onPress={onAddSale} /><Button label="Registrar gasto" onPress={onAddExpense} variant="secondary" /></View>}
    <Button label="Abrir calculadora" onPress={onOpenCalculator} variant="secondary" />
    <Text style={styles.note}>La ganancia estimada es una referencia simple: ventas menos gastos.</Text>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { color: colors.text, fontSize: 34, fontWeight: '800' }, today: { color: colors.muted, fontSize: 18, fontWeight: '600' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.medium }, count: { color: colors.muted, fontWeight: '600' }, actions: { gap: 12 }, note: { color: colors.muted, lineHeight: 20, textAlign: 'center' },
});
