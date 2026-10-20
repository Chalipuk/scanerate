import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TabScreenProps = {
  /** ป้ายเล็กเหนือหัวข้อ เช่น "01 — Scan" */
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

/** โครงหน้าของแต่ละแท็บ: เลื่อนได้ เว้นขอบจอ + แถบแท็บ และจำกัดความกว้างบนจอใหญ่ */
export function TabScreen({ eyebrow, title, subtitle, children }: TabScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: insets.top + Spacing.five,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.eyebrow}>
            <View style={[styles.eyebrowDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="eyebrow" themeColor="textSecondary">
              {eyebrow}
            </ThemedText>
          </View>
          <ThemedText type="heading">{title}</ThemedText>
          {subtitle ? (
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.two,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subtitle: {
    maxWidth: 520,
  },
});
