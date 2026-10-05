import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import type { Transaction } from '../types/transaction';
import { formatCurrency } from '../utils/currency';
import { formatTransactionDate } from '../utils/dates';

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const sale = transaction.type === 'sale';
  const detail = transaction.description || transaction.category || (sale ? 'Venta' : 'Gasto');
  return <View accessibilityLabel={`${sale ? 'Venta' : 'Gasto'}, ${detail}, ${formatCurrency(transaction.amount)}`} style={styles.row}>
    <View style={[styles.badge, sale ? styles.saleBadge : styles.expenseBadge]}><Text style={styles.badgeText}>{sale ? 'V' : 'G'}</Text></View>
    <View style={styles.content}><Text style={styles.type}>{sale ? 'Venta' : 'Gasto'}</Text><Text numberOfLines={1} style={styles.detail}>{detail}</Text><Text style={styles.date}>{formatTransactionDate(new Date(transaction.transactionDate))}</Text></View>
    <Text style={[styles.amount, sale ? styles.sale : styles.expense]}>{sale ? '+' : '−'} {formatCurrency(transaction.amount)}</Text>
  </View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: spacing.medium, borderBottomWidth: 1, borderBottomColor: colors.border }, badge: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, saleBadge: { backgroundColor: '#DDF3E8' }, expenseBadge: { backgroundColor: '#F9E1E1' }, badgeText: { color: colors.text, fontWeight: '900' }, content: { flex: 1 }, type: { color: colors.text, fontWeight: '800' }, detail: { color: colors.text }, date: { color: colors.muted, fontSize: 12 }, amount: { fontWeight: '800', fontSize: 16 }, sale: { color: colors.sale }, expense: { color: colors.expense } });
