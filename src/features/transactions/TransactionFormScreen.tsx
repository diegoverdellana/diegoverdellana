import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { CurrencyInput } from '../../components/FinancialInput';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme';
import type { CreateTransactionInput, TransactionType } from '../../types/transaction';
import { parseLocalDate, toDateInput } from '../../utils/dates';

interface Props { type: TransactionType; onSave: (input: CreateTransactionInput) => Promise<void>; onBack: () => void }
const expenseCategories = ['Mercadería', 'Materiales', 'Delivery', 'Publicidad', 'Servicios', 'Transporte', 'Otros'] as const;

export function TransactionFormScreen({ type, onSave, onBack }: Props) {
  const isSale = type === 'sale';
  const [amount, setAmount] = useState(''); const [category, setCategory] = useState('');
  const [description, setDescription] = useState(''); const [date, setDate] = useState(toDateInput()); const [saving, setSaving] = useState(false);
  const submit = async () => {
    const numericAmount = Number(amount.replace(',', '.')); const transactionDate = parseLocalDate(date);
    if (!amount.trim()) { Alert.alert('Falta el monto', 'Ingresa un monto para continuar.'); return; }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) { Alert.alert('Revisa el monto', 'Ingresa un monto válido mayor a cero.'); return; }
    if (!transactionDate) { Alert.alert('Revisa la fecha', 'Usa una fecha válida con el formato AAAA-MM-DD.'); return; }
    setSaving(true);
    try { await onSave({ type, amount: numericAmount, category, description, transactionDate }); }
    finally { setSaving(false); }
  };
  return <Screen><Text style={styles.title}>{isSale ? 'Registrar venta' : 'Registrar gasto'}</Text>
    <CurrencyInput label="Monto" value={amount} onChangeText={setAmount} placeholder="0.00" autoFocus />
    {!isSale && <View style={styles.field}><Text style={styles.label}>Categoría (opcional)</Text><View style={styles.categories}>{expenseCategories.map((item) => <Pressable accessibilityRole="button" accessibilityState={{ selected: category === item }} key={item} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.selectedCategory]}><Text style={[styles.categoryText, category === item && styles.selectedCategoryText]}>{item}</Text></Pressable>)}</View></View>}
    <FormField label="Descripción (opcional)" value={description} onChangeText={setDescription} placeholder="Agrega una nota" />
    <FormField label="Fecha" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
    <Button label={saving ? 'Guardando…' : isSale ? 'Guardar venta' : 'Guardar gasto'} onPress={() => void submit()} disabled={saving} /><Button label="Volver" onPress={onBack} variant="secondary" />
  </Screen>;
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 30, fontWeight: '800', marginBottom: 8 }, field: { gap: 8 }, label: { color: colors.text, fontWeight: '600', fontSize: 15 }, categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, category: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 13, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, selectedCategory: { backgroundColor: colors.primary, borderColor: colors.primary }, categoryText: { color: colors.text, fontWeight: '600' }, selectedCategoryText: { color: '#FFF' } });
