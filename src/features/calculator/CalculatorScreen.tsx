import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { CurrencyInput, PercentageInput } from '../../components/FinancialInput';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme';
import { calculatePriceRecommendation, type PricingInput } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currency';

interface Props { onBack: () => void; onCalculated?: () => void }
const fields: { key: keyof PricingInput; label: string }[] = [
  { key: 'productCost', label: 'Costo del producto' }, { key: 'packagingCost', label: 'Empaque' }, { key: 'deliveryCost', label: 'Envío' },
  { key: 'advertisingCost', label: 'Publicidad' }, { key: 'otherCosts', label: 'Otros costos' }, { key: 'paymentFeePercentage', label: 'Comisión de pago %' }, { key: 'desiredMarginPercentage', label: 'Margen deseado %' },
];
const initialValues: Record<keyof PricingInput, string> = { productCost: '', packagingCost: '', deliveryCost: '', advertisingCost: '', otherCosts: '', paymentFeePercentage: '', desiredMarginPercentage: '' };

function parseNumericInput(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toPricingInput(values: Record<keyof PricingInput, string>): PricingInput {
  return {
    productCost: parseNumericInput(values.productCost),
    packagingCost: parseNumericInput(values.packagingCost),
    deliveryCost: parseNumericInput(values.deliveryCost),
    advertisingCost: parseNumericInput(values.advertisingCost),
    otherCosts: parseNumericInput(values.otherCosts),
    paymentFeePercentage: parseNumericInput(values.paymentFeePercentage),
    desiredMarginPercentage: parseNumericInput(values.desiredMarginPercentage),
  };
}

export function CalculatorScreen({ onBack, onCalculated }: Props) {
  const [values, setValues] = useState(initialValues); const [calculated, setCalculated] = useState(false);
  const input = useMemo(() => toPricingInput(values), [values]);
  const result = useMemo(() => { if (!calculated) return null; try { return calculatePriceRecommendation(input); } catch { return null; } }, [calculated, input]);
  const calculate = () => {
    try { calculatePriceRecommendation(input); setCalculated(true); onCalculated?.(); }
    catch (error) { setCalculated(false); Alert.alert('Revisa los porcentajes', error instanceof Error && error.message === 'INVALID_PERCENTAGE_SUM' ? 'El margen y la comisión juntos deben ser menores a 100%.' : 'Ingresa costos y porcentajes válidos, sin valores negativos.'); }
  };
  return <Screen><Text style={styles.title}>Calculadora de precio</Text><Text style={styles.subtitle}>Encuentra un precio de referencia para tu producto.</Text>
    {fields.map(({ key, label }) => { const Input = key === 'paymentFeePercentage' || key === 'desiredMarginPercentage' ? PercentageInput : CurrencyInput; return <Input key={key} label={label} value={values[key]} onChangeText={(value) => { setCalculated(false); setValues((current) => ({ ...current, [key]: value })); }} placeholder="0" />; })}
    <Button label="Calcular precio" onPress={calculate} />
    {result && <View style={styles.result}><Text style={styles.resultTitle}>Resultado</Text><Result label="Costo real estimado" value={formatCurrency(result.baseCost)} /><Result label="Precio sugerido" value={formatCurrency(result.recommendedPrice)} emphasized /><Result label="Ganancia estimada" value={formatCurrency(result.estimatedProfit)} /><Result label="Margen" value={`${result.margin.toFixed(2)}%`} /><Result label="Markup" value={`${result.markup.toFixed(2)}%`} /></View>}
    <Button label="Volver" onPress={onBack} variant="secondary" /></Screen>;
}
function Result({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) { return <View style={styles.row}><Text style={styles.resultLabel}>{label}</Text><Text style={[styles.resultValue, emphasized && styles.emphasized]}>{value}</Text></View>; }
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 30, fontWeight: '800' }, subtitle: { color: colors.muted, fontSize: 16, marginBottom: 6 }, result: { backgroundColor: colors.surface, borderRadius: 18, padding: 20, gap: 13 }, resultTitle: { fontSize: 20, fontWeight: '800', color: colors.text }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }, resultLabel: { color: colors.muted, flex: 1 }, resultValue: { color: colors.text, fontWeight: '700', fontSize: 17 }, emphasized: { color: colors.primary, fontSize: 24 } });
