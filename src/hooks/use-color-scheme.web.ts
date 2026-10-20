import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  // ฝั่ง server (และตอน hydrate) ได้ false, ฝั่ง client ได้ true — แทน setState ใน useEffect ที่ lint ไม่ให้ผ่าน
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}

/* ===== BACKUP: โค้ดเดิมจาก Expo template (ไม่ผ่าน lint react-hooks/set-state-in-effect) =====
 * วิธีสลับกลับ: ลบโค้ดใหม่ด้านบน แล้วเอาเครื่องหมายคอมเมนต์ของบล็อกนี้ออก

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}

===== END BACKUP ===== */
