import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

interface Option<T extends string> { key: T; label: string }
interface Props<T extends string> { value: T; options: readonly Option<T>[]; onChange: (value: T) => void }

export function PeriodSelector<T extends string>({ value, options, onChange }: Props<T>) {
  return <View accessibilityRole="tablist" style={styles.container}>{options.map((option) => {
    const selected = option.key === value;
    return <Pressable key={option.key} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange(option.key)} style={[styles.option, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
    </Pressable>;
  })}</View>;
}
const styles = StyleSheet.create({ container: { flexDirection: 'row', backgroundColor: colors.primarySoft, padding: 4, borderRadius: radius.medium }, option: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius.small }, selected: { backgroundColor: colors.surface }, label: { color: colors.primaryDark, fontWeight: '600' }, selectedLabel: { fontWeight: '800' } });
