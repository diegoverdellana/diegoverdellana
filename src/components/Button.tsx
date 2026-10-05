import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

interface Props { label: string; onPress: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean }

export function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondary, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 54, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary },
  label: { color: '#FFF', fontSize: 17, fontWeight: '700' }, secondaryLabel: { color: colors.primary },
  pressed: { opacity: 0.8 }, disabled: { opacity: 0.5 },
});
