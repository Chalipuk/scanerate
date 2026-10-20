import type { Metadata } from 'expo-router/server';
import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/components/app-icon';
import { CodeTypeCard } from '@/components/code-type-card';
import { TabScreen } from '@/components/tab-screen';
import { pageMetadata } from '@/constants/site';
import { Spacing } from '@/constants/theme';

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: 'Free QR Code Generator — Links, Wi-Fi, vCard & Barcodes · Scanerate',
    description:
      'Create QR codes for links, Wi-Fi networks, contacts (vCard) and text, or make EAN, UPC and Code 128 barcodes. Add your colors and logo, then download as PNG or SVG.',
    path: '/create',
  });
}

const CodeTypes: { key: string; label: string; caption: string; icon: IconName }[] = [
  { key: 'link', label: 'Link', caption: 'URL', icon: { sf: 'link', md: 'link' } },
  { key: 'wifi', label: 'Wi-Fi', caption: 'WPA / WEP', icon: { sf: 'wifi', md: 'wifi' } },
  {
    key: 'contact',
    label: 'Contact',
    caption: 'vCard',
    icon: { sf: 'person.crop.rectangle', md: 'contact_page' },
  },
  { key: 'text', label: 'Text', caption: 'Plain text', icon: { sf: 'text.alignleft', md: 'notes' } },
  {
    key: 'barcode',
    label: 'Barcode',
    caption: 'EAN · UPC · CODE 128',
    icon: { sf: 'barcode', md: 'barcode' },
  },
];

export default function CreateScreen() {
  return (
    <TabScreen
      eyebrow="02 — Create"
      title="Make a code"
      subtitle="Pick a type to generate a QR code or barcode — with your own colors, logo and PNG / SVG download.">
      <View style={styles.grid}>
        {CodeTypes.map(({ key, ...type }) => (
          <CodeTypeCard key={key} {...type} />
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three - 4,
  },
});
