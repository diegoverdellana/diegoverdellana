import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

interface Props { title: string; description?: string; primaryAction?: { label: string; onPress: () => void }; secondaryAction?: { label: string; onPress: () => void } }
export function EmptyState({ title, description, primaryAction, secondaryAction }: Props) {
  return <View style={styles.container}><Text style={styles.icon}>◎</Text><Text style={styles.title}>{title}</Text>{description && <Text style={styles.description}>{description}</Text>}
    {primaryAction && <Button label={primaryAction.label} onPress={primaryAction.onPress} />}{secondaryAction && <Button label={secondaryAction.label} onPress={secondaryAction.onPress} variant="secondary" />}
  </View>;
}
const styles = StyleSheet.create({ container: { paddingVertical: spacing.xlarge, gap: spacing.medium }, icon: { color: colors.primary, fontSize: 42 }, title: { color: colors.text, fontSize: typography.heading, fontWeight: '800' }, description: { color: colors.muted, fontSize: typography.body, lineHeight: 23 } });
