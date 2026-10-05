import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { formatCurrency } from '../utils/currency';

export function MetricCard({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'sale' | 'expense' | 'default' }) {
  const color = tone === 'sale' ? colors.sale : tone === 'expense' ? colors.expense : colors.primaryDark;
  return <View style={styles.card}><Text style={styles.label}>{label}</Text><Text adjustsFontSizeToFit numberOfLines={1} style={[styles.value, { color }]}>{formatCurrency(value)}</Text></View>;
}
const styles = StyleSheet.create({ card: { flex: 1, minWidth: 140, backgroundColor: colors.surface, borderRadius: radius.large, padding: spacing.medium, gap: spacing.small, ...shadows.card }, label: { color: colors.muted, fontSize: typography.caption, fontWeight: '700' }, value: { fontSize: typography.metric, fontWeight: '800' } });
