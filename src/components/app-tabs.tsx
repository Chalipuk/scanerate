import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { TabItems } from '@/constants/tabs';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.accentMuted}
      tintColor={colors.accent}
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      labelStyle={{ default: { color: colors.textSecondary }, selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{TabItems.scan.label}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={TabItems.scan.sf} md={TabItems.scan.md} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Label>{TabItems.create.label}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={TabItems.create.sf} md={TabItems.create.md} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>{TabItems.history.label}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={TabItems.history.sf} md={TabItems.history.md} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

/* ===== BACKUP: แท็บเดิมจาก Expo template (Home / Explore) =====
 * วิธีสลับกลับ: ลบโค้ดใหม่ด้านบน แล้วเอาเครื่องหมายคอมเมนต์ของบล็อกนี้ออก
 * (ต้องกู้หน้า Explore คืนด้วย: git checkout 287e3eb -- src/app/explore.tsx)

import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

===== END BACKUP ===== */
