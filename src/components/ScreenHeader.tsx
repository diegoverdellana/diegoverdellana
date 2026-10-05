import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.container}><Text accessibilityRole="header" style={styles.title}>{title}</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
const styles = StyleSheet.create({ container: { gap: 4 }, title: { color: colors.text, fontSize: typography.title, fontWeight: '800' }, subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 22 } });
