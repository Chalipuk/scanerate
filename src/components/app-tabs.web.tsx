import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/app-icon';
import { Palette } from '@/constants/palette';
import { TabItems, type TabItem } from '@/constants/tabs';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import classes from './app-tabs.module.css';
import { ThemedText } from './themed-text';

// จอกว้าง: แท็บอยู่ขวาในแถบหัว · จอแคบ (มือถือ): แท็บย้ายลงล่างแบบแอป
// สลับด้วย CSS media query (app-tabs.module.css) — HTML ที่ render ล่วงหน้าจึงถูกตั้งแต่แรก ไม่กระตุก
export default function AppTabs() {
  return (
    <Tabs>
      <TabList asChild>
        <AppHeader>
          <TabTrigger name="scan" href="/" asChild>
            <TabButton item={TabItems.scan} />
          </TabTrigger>
          <TabTrigger name="create" href="/create" asChild>
            <TabButton item={TabItems.create} />
          </TabTrigger>
          <TabTrigger name="history" href="/history" asChild>
            <TabButton item={TabItems.history} />
          </TabTrigger>
        </AppHeader>
      </TabList>
      <div className={classes.slot}>
        <TabSlot />
      </div>
    </Tabs>
  );
}

// ตัด ref ออกจาก type: TabTriggerSlotProps ใช้ RefAttributes<View> ซึ่งชนกับ type ของ Pressable ใน RN 0.88
type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & { item: TabItem };

export function TabButton({ item, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabPressable, pressed && styles.pressed]}>
      <div className={classes.tab} data-active={isFocused ? 'true' : undefined}>
        <AppIcon icon={item} size={18} color={isFocused ? theme.accent : theme.textSecondary} />
        <ThemedText
          type="small"
          themeColor={isFocused ? 'text' : 'textSecondary'}
          style={styles.tabLabel}>
          {item.label}
        </ThemedText>
      </div>
    </Pressable>
  );
}

export function AppHeader({ children, ...props }: TabListProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <View style={styles.headerInner}>
        <View style={styles.brand}>
          <LogoMark />
          <ThemedText style={styles.wordmark}>Scanerate</ThemedText>
          <View style={[styles.badge, { borderColor: theme.border }]}>
            <ThemedText type="eyebrow" themeColor="textSecondary" style={styles.badgeText}>
              Beta
            </ThemedText>
          </View>
        </View>
        <div className={classes.tabs}>{children}</div>
      </View>
    </View>
  );
}

/** โลโก้เดียวกับ public/favicon.svg */
function LogoMark() {
  const accent = Palette.dark.accent;

  return (
    <svg width={28} height={28} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="14" fill={Palette.dark.background} />
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="13.5"
        fill="none"
        stroke={Palette.dark.border}
      />
      <g fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 24v-5a5 5 0 0 1 5-5h5" />
        <path d="M40 14h5a5 5 0 0 1 5 5v5" />
        <path d="M50 40v5a5 5 0 0 1-5 5h-5" />
        <path d="M24 50h-5a5 5 0 0 1-5-5v-5" />
      </g>
      <g fill={Palette.dark.text}>
        <rect x="22" y="21" width="8" height="8" rx="1.5" />
        <rect x="34" y="21" width="8" height="8" rx="1.5" />
        <rect x="22" y="35" width="8" height="8" rx="1.5" />
        <rect x="35" y="36" width="3" height="3" rx="0.75" />
        <rect x="39" y="40" width="3" height="3" rx="0.75" />
      </g>
      <rect x="17" y="30.75" width="30" height="2.5" rx="1.25" fill={accent} />
    </svg>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  wordmark: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 600,
    letterSpacing: -0.3,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.two - 2,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
  },
  tabPressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 13,
    lineHeight: 16,
  },
});

/* ===== BACKUP: แถบแท็บเว็บเดิมจาก Expo template (Home / Explore + ลิงก์ Docs) =====
 * วิธีสลับกลับ: ลบโค้ดใหม่ด้านบน แล้วเอาเครื่องหมายคอมเมนต์ของบล็อกนี้ออก
 * (ต้องกู้หน้า Explore คืนด้วย: git checkout 287e3eb -- src/app/explore.tsx)

import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});

===== END BACKUP ===== */
