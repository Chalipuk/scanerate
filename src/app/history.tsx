import { router } from 'expo-router';
import type { Metadata } from 'expo-router/server';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { TabScreen } from '@/components/tab-screen';
import { pageMetadata } from '@/constants/site';
import { TabItems } from '@/constants/tabs';

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: 'Scan History · Scanerate',
    description: 'Your recent QR code and barcode scans in Scanerate.',
    path: '/history',
    // หน้านี้เป็นข้อมูลส่วนตัวของแต่ละคน ไม่ต้องให้ Google เก็บ
    noIndex: true,
  });
}

export default function HistoryScreen() {
  return (
    <TabScreen
      eyebrow="03 — History"
      title="Recent scans"
      subtitle="Everything you scan shows up here, newest first.">
      <EmptyState
        icon={TabItems.history}
        title="No scans yet"
        message="Scan a QR code or barcode and it will appear here.">
        <Button label="Open scanner" icon={TabItems.scan} onPress={() => router.navigate('/')} />
      </EmptyState>
    </TabScreen>
  );
}

