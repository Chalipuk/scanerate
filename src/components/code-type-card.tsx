import { StyleSheet, View } from 'react-native';

import { AppIcon, type IconName } from './app-icon';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CodeTypeCardProps = {
  icon: IconName;
  label: string;
  /** คำอธิบายสั้นแบบ mono เช่น "vCard" */
  caption: string;
};

/** การ์ดชนิดโค้ดในหน้า Create — ตอนนี้ยังกดไม่ได้ (ป้าย Soon) */
export function CodeTypeCard({ icon, label, caption }: CodeTypeCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.background }]}>
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: theme.accentMuted }]}>
          <AppIcon icon={icon} size={20} color={theme.accent} />
        </View>
        <View style={[styles.badge, { borderColor: theme.border }]}>
          <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.badgeText}>
            Soon
          </ThemedText>
        </View>
      </View>
      <View style={styles.text}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <ThemedText type="code" themeColor="textSecondary">
          {caption}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '40%',
    minWidth: 140,
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
  },
  text: {
    gap: Spacing.half,
  },
});
