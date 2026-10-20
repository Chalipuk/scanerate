// โทนขาวดำ (zinc) + สีเน้นฟ้าไซแอนสีเดียว
// แยกไฟล์จาก theme.ts เพราะ +html.tsx ต้องใช้สีนี้แต่ห้าม import global.css
export const Palette = {
  light: {
    text: '#09090B',
    background: '#FFFFFF',
    backgroundElement: '#F4F4F5',
    backgroundSelected: '#E4E4E7',
    textSecondary: '#71717A',
    border: '#E4E4E7',
    accent: '#0891B2',
    accentMuted: 'rgba(8, 145, 178, 0.1)',
    // สีสถานะความปลอดภัยของลิงก์
    success: '#15803D',
    successMuted: 'rgba(22, 163, 74, 0.1)',
    warning: '#B45309',
    warningMuted: 'rgba(217, 119, 6, 0.1)',
    danger: '#DC2626',
    dangerMuted: 'rgba(220, 38, 38, 0.1)',
  },
  dark: {
    text: '#FAFAFA',
    background: '#09090B',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',
    textSecondary: '#A1A1AA',
    border: '#27272A',
    accent: '#22D3EE',
    accentMuted: 'rgba(34, 211, 238, 0.12)',
    success: '#4ADE80',
    successMuted: 'rgba(74, 222, 128, 0.12)',
    warning: '#FBBF24',
    warningMuted: 'rgba(251, 191, 36, 0.12)',
    danger: '#F87171',
    dangerMuted: 'rgba(248, 113, 113, 0.12)',
  },
} as const;

export type ThemeColor = keyof typeof Palette.light;
