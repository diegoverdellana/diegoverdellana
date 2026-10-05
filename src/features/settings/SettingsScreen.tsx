import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { ScreenHeader } from '../../components/ScreenHeader';
import { colors, radius, spacing } from '../../theme';
import type { Preferences } from '../../types/preferences';

function SettingRow({ label, value }: { label: string; value: string }) { return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
export function SettingsScreen({ preferences }: { preferences: Preferences }) {
  return <Screen><ScreenHeader title="Configuración" subtitle="Información básica de Mi Negocio." /><View style={styles.card}><SettingRow label="Moneda" value={`${preferences.currencyCode} — ${preferences.currencySymbol}`} /><SettingRow label="País" value={preferences.countryCode === 'PE' ? 'Perú' : preferences.countryCode} /><SettingRow label="Versión" value="0.1.0" /></View><View style={styles.card}><SettingRow label="Acerca de" value="Mi Negocio por Product Creators" /><SettingRow label="Privacidad" value="Información próximamente" /></View><Text style={styles.note}>Tus movimientos se guardan localmente en este dispositivo.</Text></Screen>;
}
const styles = StyleSheet.create({ card: { backgroundColor: colors.surface, borderRadius: radius.large, paddingHorizontal: spacing.medium }, row: { minHeight: 58, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.medium }, label: { color: colors.text, fontWeight: '700' }, value: { color: colors.muted, textAlign: 'right', flexShrink: 1 }, note: { color: colors.muted, lineHeight: 21 } });
