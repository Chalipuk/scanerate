import { Pressable, StyleSheet } from 'react-native';

import { AppIcon, type IconName } from './app-icon';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  /** primary = พื้นทึบ, secondary = เส้นขอบ */
  variant?: 'primary' | 'secondary';
};

export function Button({ label, icon, onPress, variant = 'primary' }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === 'primary';
  const color = primary ? theme.background : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? { backgroundColor: theme.text } : { borderColor: theme.border, borderWidth: 1 },
        pressed && styles.pressed,
      ]}>
      {icon ? <AppIcon icon={icon} size={16} color={color} /> : null}
      <ThemedText type="smallBold" style={{ color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.75,
  },
});
