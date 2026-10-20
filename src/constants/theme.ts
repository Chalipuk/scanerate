/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

import { Palette, type ThemeColor } from './palette';

export { Palette, type ThemeColor };

type ColorTokens = Record<ThemeColor, string>;

// เว็บใช้ CSS variables (ประกาศใน src/app/+html.tsx) — HTML ที่ render ล่วงหน้าจะเปลี่ยนสีตามโหมดมืดได้ทันที ไม่กระพริบเป็นสีขาวก่อน
const webColors = Object.fromEntries(
  Object.keys(Palette.light).map((key) => [key, `var(--color-${key})`])
) as ColorTokens;

export const Colors: Record<'light' | 'dark', ColorTokens> =
  Platform.OS === 'web' ? { light: webColors, dark: webColors } : Palette;

/* ===== BACKUP: สีเดิมจาก Expo template =====
 * วิธีสลับกลับ: ลบ Palette / ThemeColor / webColors / Colors ด้านบน แล้วเอาคอมเมนต์ของบล็อกนี้ออก
 * (ต้องลบ token ใหม่ border / accent / accentMuted ที่คอมโพเนนต์อื่นเรียกใช้ด้วย)

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

===== END BACKUP ===== */

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
