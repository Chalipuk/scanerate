import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type IconName } from './app-icon';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  /** ปุ่มหรือเนื้อหาเพิ่มเติมใต้ข้อความ */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ icon, title, message, children, style }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.border }, style]}>
      <View style={[styles.iconBox, { backgroundColor: theme.accentMuted }]}>
        <AppIcon icon={icon} size={24} color={theme.accent} />
      </View>
      <View style={styles.text}>
        <ThemedText type="smallBold" style={styles.centerText}>
          {title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          {message}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    gap: Spacing.one,
    maxWidth: 320,
  },
  centerText: {
    textAlign: 'center',
  },
});
