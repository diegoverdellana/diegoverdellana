import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { colors, spacing } from '../../theme';
import type { TransactionTotals } from '../../types/transaction';
import { formatCurrency } from '../../utils/currency';

interface Props { totals: TransactionTotals; onAddSale: () => void; onAddExpense: () => void; onOpenCalculator: () => void }

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricValue, { color }]}>{formatCurrency(value)}</Text></View>;
}

export function DashboardScreen({ totals, onAddSale, onAddExpense, onOpenCalculator }: Props) {
  return <Screen>
    <Text style={styles.brand}>PRODUCT CREATORS</Text><Text style={styles.title}>Mi Negocio</Text><Text style={styles.today}>Hoy</Text>
    <View style={styles.card}>
      <Metric label="Ventas" value={totals.sales} color={colors.sale} />
      <View style={styles.divider} /><Metric label="Gastos" value={totals.expenses} color={colors.expense} />
      <View style={styles.divider} /><Metric label="Ganancia estimada" value={totals.estimatedProfit} color={colors.primaryDark} />
    </View>
    <View style={styles.actions}><Button label="Registrar venta" onPress={onAddSale} /><Button label="Registrar gasto" onPress={onAddExpense} variant="secondary" /><Button label="Abrir calculadora" onPress={onOpenCalculator} variant="secondary" /></View>
    <Text style={styles.note}>La ganancia estimada es una referencia simple: ventas menos gastos.</Text>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { color: colors.text, fontSize: 34, fontWeight: '800' }, today: { color: colors.muted, fontSize: 18, fontWeight: '600' },
  card: { backgroundColor: colors.surface, padding: spacing.large, borderRadius: 20, gap: spacing.medium }, metric: { gap: 4 }, metricLabel: { color: colors.muted, fontSize: 16 }, metricValue: { fontSize: 32, fontWeight: '800' }, divider: { height: 1, backgroundColor: colors.border }, actions: { gap: 12 }, note: { color: colors.muted, lineHeight: 20, textAlign: 'center' },
});
