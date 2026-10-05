import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { colors, spacing, typography } from '../../theme';

const pages = [
  { title: 'Controla tu negocio sin complicarte', text: 'Registra lo que vendes y lo que gastas.' },
  { title: 'Entiende cuánto estás ganando', text: 'Revisa cómo va tu negocio hoy, esta semana o este mes.' },
  { title: 'Empieza ahora', text: 'Todo queda guardado en tu teléfono, incluso sin internet.' },
] as const;

export function OnboardingScreen({ onComplete }: { onComplete: () => Promise<void> }) {
  const [page, setPage] = useState(0); const [saving, setSaving] = useState(false);
  const current = pages[page] ?? pages[0]; const last = page === pages.length - 1;
  const advance = async () => { if (!last) { setPage((value) => value + 1); return; } setSaving(true); try { await onComplete(); } finally { setSaving(false); } };
  return <Screen><View style={styles.brand}><Text style={styles.brandText}>PRODUCT CREATORS</Text></View><View style={styles.content}><Text style={styles.step}>{page + 1} de {pages.length}</Text><Text accessibilityRole="header" style={styles.title}>{current.title}</Text><Text style={styles.text}>{current.text}</Text></View><View style={styles.dots}>{pages.map((_, index) => <View key={index} style={[styles.dot, index === page && styles.activeDot]} />)}</View><Button label={last ? (saving ? 'Guardando…' : 'Comenzar') : 'Continuar'} onPress={() => void advance()} disabled={saving} /></Screen>;
}
const styles = StyleSheet.create({ brand: { paddingTop: spacing.large }, brandText: { color: colors.primary, fontWeight: '900', letterSpacing: 1.5 }, content: { flex: 1, justifyContent: 'center', gap: spacing.medium }, step: { color: colors.primary, fontWeight: '700' }, title: { color: colors.text, fontSize: 36, lineHeight: 42, fontWeight: '900' }, text: { color: colors.muted, fontSize: typography.heading, lineHeight: 30 }, dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border }, activeDot: { width: 24, backgroundColor: colors.primary } });
