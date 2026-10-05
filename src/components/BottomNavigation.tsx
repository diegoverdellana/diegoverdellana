import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { RootTab } from '../types/navigation';

const tabs: { key: RootTab; label: string; icon: string }[] = [
  { key: 'home', label: 'Inicio', icon: '⌂' }, { key: 'history', label: 'Historial', icon: '≡' },
  { key: 'calculator', label: 'Calculadora', icon: '＋' }, { key: 'settings', label: 'Configuración', icon: '⚙' },
];
export function BottomNavigation({ active, onSelect }: { active: RootTab; onSelect: (tab: RootTab) => void }) {
  return <View style={styles.container}>{tabs.map((tab) => { const selected = active === tab.key; return <Pressable key={tab.key} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onSelect(tab.key)} style={styles.tab}><Text style={[styles.icon, selected && styles.selected]}>{tab.icon}</Text><Text numberOfLines={1} style={[styles.label, selected && styles.selected]}>{tab.label}</Text></Pressable>; })}</View>;
}
const styles = StyleSheet.create({ container: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, minHeight: 70 }, tab: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 2 }, icon: { color: colors.muted, fontSize: 22 }, label: { color: colors.muted, fontSize: 11, fontWeight: '600' }, selected: { color: colors.primary, fontWeight: '800' } });
