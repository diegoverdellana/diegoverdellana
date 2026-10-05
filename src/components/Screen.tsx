import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export function Screen({ children }: PropsWithChildren) {
  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background }, content: { flexGrow: 1, padding: spacing.large, gap: spacing.medium } });
