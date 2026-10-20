import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'heading'
    | 'eyebrow';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[styles.base, { color: theme[themeColor ?? 'text'] }, styles[type], style]}
      {...rest}
    />
  );
}

/* ===== BACKUP: ของเดิมจาก Expo template (ไม่มี type heading / eyebrow และไม่ได้ตั้งฟอนต์บนเว็บ) =====
 * วิธีสลับกลับ: แทน type และฟังก์ชัน ThemedText ด้านบนด้วยโค้ดนี้ แล้วลบ styles.base / heading / eyebrow

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

===== END BACKUP ===== */

const styles = StyleSheet.create({
  // บนเว็บใช้ Geist (จาก global.css) ส่วนมือถือใช้ฟอนต์ระบบ
  base: Platform.select({ web: { fontFamily: Fonts.sans } }) ?? {},
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
  heading: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 600,
    letterSpacing: -0.8,
  },
  eyebrow: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
