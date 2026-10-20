import { scanFromURLAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import type { Metadata } from 'expo-router/server';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/app-icon';
import { Button } from '@/components/button';
import { BARCODE_TYPES, Scanner } from '@/components/scanner';
import { ScanSheet } from '@/components/scan-sheet';
import { TabScreen } from '@/components/tab-screen';
import { ThemedText } from '@/components/themed-text';
import { pageMetadata, Site } from '@/constants/site';
import { Spacing } from '@/constants/theme';
import { useImageDrop } from '@/hooks/use-image-drop';
import type { ScanResult } from '@/utils/scan-result';

const ImageIcon: IconName = { sf: 'photo.on.rectangle', md: 'image' };

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: 'Scanerate — Free QR Code & Barcode Scanner Online',
    description: Site.description,
    path: '/',
  });
}

export default function ScanScreen() {
  // มีผลสแกน = หยุดกล้อง ล็อกมุมกรอบ แล้วเลื่อนแผ่นผลขึ้นมา (ปิดแผ่น = สแกนใหม่)
  const [result, setResult] = useState<ScanResult | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // สแกนจากรูป — ไม่ต้องใช้กล้อง (คนที่เปิดเว็บจากคอมก็ลองได้)
  const scanImage = async (uri: string) => {
    setImageError(null);
    try {
      const [found] = await scanFromURLAsync(uri, BARCODE_TYPES);
      if (found) {
        setResult({ type: found.type, data: found.data });
      } else {
        setImageError('No QR code or barcode found in that image.');
      }
    } catch {
      setImageError('Could not read that image.');
    } finally {
      if (uri.startsWith('blob:')) URL.revokeObjectURL(uri);
    }
  };

  const pickImage = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (!picked.canceled) scanImage(picked.assets[0].uri);
  };

  useImageDrop(scanImage, result === null);

  return (
    <TabScreen
      eyebrow="01 — Scan"
      title="Scan any code"
      subtitle="Point your camera at a QR code or barcode. You'll see the link before anything opens.">
      <Scanner onScan={setResult} locked={result !== null} lockBounds={result?.bounds} />

      <View style={styles.imageRow}>
        <Button variant="secondary" label="Scan from image" icon={ImageIcon} onPress={pickImage} />
        {Platform.OS === 'web' ? (
          <ThemedText type="small" themeColor="textSecondary">
            or paste / drop an image anywhere
          </ThemedText>
        ) : null}
        {imageError ? (
          <ThemedText type="small" themeColor="danger" style={styles.center}>
            {imageError}
          </ThemedText>
        ) : null}
      </View>

      <ThemedText type="code" themeColor="textSecondary" style={styles.formats}>
        QR · EAN · UPC · CODE 128 · PDF417
      </ThemedText>

      <ScanSheet result={result} onClose={() => setResult(null)} />
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  imageRow: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  formats: {
    textAlign: 'center',
    letterSpacing: 1,
  },
});

/* ===== BACKUP: หน้า Welcome เดิมจาก Expo template =====
 * วิธีสลับกลับ: ลบโค้ดใหม่ด้านบนทั้งหมด แล้วเอาเครื่องหมายคอมเมนต์ของบล็อกนี้ออก

import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});

===== END BACKUP ===== */
