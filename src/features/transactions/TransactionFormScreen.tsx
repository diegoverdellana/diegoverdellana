import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme';
import type { CreateTransactionInput, TransactionType } from '../../types/transaction';
import { parseLocalDate, toDateInput } from '../../utils/dates';

interface Props { type: TransactionType; onSave: (input: CreateTransactionInput) => Promise<void>; onBack: () => void }

export function TransactionFormScreen({ type, onSave, onBack }: Props) {
  const isSale = type === 'sale';
  const [amount, setAmount] = useState(''); const [category, setCategory] = useState('');
  const [description, setDescription] = useState(''); const [date, setDate] = useState(toDateInput()); const [saving, setSaving] = useState(false);
  const submit = async () => {
    const numericAmount = Number(amount.replace(',', '.')); const transactionDate = parseLocalDate(date);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) { Alert.alert('Revisa el monto', 'Ingresa un monto mayor a cero.'); return; }
    if (!transactionDate) { Alert.alert('Revisa la fecha', 'Usa una fecha válida con el formato AAAA-MM-DD.'); return; }
    setSaving(true);
    try { await onSave({ type, amount: numericAmount, category, description, transactionDate }); }
    finally { setSaving(false); }
  };
  return <Screen><Text style={styles.title}>{isSale ? 'Registrar venta' : 'Registrar gasto'}</Text>
    <FormField label="Monto" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" autoFocus />
    {!isSale && <FormField label="Categoría (opcional)" value={category} onChangeText={setCategory} placeholder="Ej. Insumos" />}
    <FormField label="Descripción (opcional)" value={description} onChangeText={setDescription} placeholder="Agrega una nota" />
    <FormField label="Fecha" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
    <Button label={saving ? 'Guardando…' : 'Guardar'} onPress={() => void submit()} disabled={saving} /><Button label="Volver" onPress={onBack} variant="secondary" />
  </Screen>;
}
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 30, fontWeight: '800', marginBottom: 8 } });
