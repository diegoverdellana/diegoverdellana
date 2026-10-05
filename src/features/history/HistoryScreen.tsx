import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { PeriodSelector } from '../../components/PeriodSelector';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TransactionRow } from '../../components/TransactionRow';
import { colors, radius, spacing } from '../../theme';
import type { HistoryPeriodKey } from '../../types/navigation';
import type { Transaction } from '../../types/transaction';

const options = [{ key: 'today', label: 'Hoy' }, { key: 'week', label: 'Semana' }, { key: 'month', label: 'Mes' }, { key: 'all', label: 'Todos' }] as const;
export function HistoryScreen({ transactions, period, onPeriodChange }: { transactions: Transaction[]; period: HistoryPeriodKey; onPeriodChange: (period: HistoryPeriodKey) => void }) {
  return <Screen><ScreenHeader title="Historial" subtitle="Tus movimientos, del más reciente al más antiguo." /><PeriodSelector value={period} options={options} onChange={onPeriodChange} />
    {transactions.length === 0 ? <EmptyState title="Aquí aparecerán tus movimientos." description="Registra una venta o un gasto para comenzar." /> : <View style={styles.list}>{transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</View>}
  </Screen>;
}
const styles = StyleSheet.create({ list: { backgroundColor: colors.surface, borderRadius: radius.large, paddingHorizontal: spacing.medium } });
