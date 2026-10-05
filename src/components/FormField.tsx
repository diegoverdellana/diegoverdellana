import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../theme';

interface Props extends TextInputProps { label: string }

export function FormField({ label, ...inputProps }: Props) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...inputProps} style={styles.input} placeholderTextColor={colors.muted} /></View>;
}

const styles = StyleSheet.create({
  field: { gap: 7 }, label: { color: colors.text, fontWeight: '600', fontSize: 15 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, paddingHorizontal: 14, fontSize: 17, color: colors.text },
});
