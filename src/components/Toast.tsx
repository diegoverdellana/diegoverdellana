import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
export function Toast({ message }: { message: string }) { return <View accessibilityRole="alert" style={styles.toast}><Text style={styles.text}>✓ {message}</Text></View>; }
const styles = StyleSheet.create({ toast: { position: 'absolute', left: spacing.medium, right: spacing.medium, bottom: 86, backgroundColor: colors.primaryDark, borderRadius: radius.medium, padding: spacing.medium, zIndex: 10 }, text: { color: '#FFF', fontWeight: '700', textAlign: 'center' } });
