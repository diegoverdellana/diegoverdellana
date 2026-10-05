import type { TextInputProps } from 'react-native';
import { FormField } from './FormField';

type Props = Omit<TextInputProps, 'keyboardType'> & { label: string };

export function CurrencyInput(props: Props) {
  return <FormField {...props} keyboardType="decimal-pad" />;
}

export function PercentageInput(props: Props) {
  return <FormField {...props} keyboardType="decimal-pad" />;
}
