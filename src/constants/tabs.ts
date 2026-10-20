import type { IconName } from '@/components/app-icon';

export type TabItem = IconName & { label: string };

export const TabItems: Record<'scan' | 'create' | 'history', TabItem> = {
  scan: { label: 'Scan', sf: 'qrcode.viewfinder', md: 'qr_code_scanner' },
  create: { label: 'Create', sf: 'qrcode', md: 'qr_code_2' },
  history: { label: 'History', sf: 'clock.arrow.circlepath', md: 'history' },
};
