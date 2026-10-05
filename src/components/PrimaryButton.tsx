import { Button } from './Button';

interface Props { label: string; onPress: () => void; disabled?: boolean }
export function PrimaryButton(props: Props) { return <Button {...props} />; }
export function SecondaryButton(props: Props) { return <Button {...props} variant="secondary" />; }
