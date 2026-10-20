import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';

export type IconName = {
  /** ไอคอนฝั่ง iOS (SF Symbols) */
  sf: SFSymbol;
  /** ไอคอนฝั่ง Android + เว็บ (Material Symbols) */
  md: AndroidSymbol;
};

type AppIconProps = {
  icon: IconName;
  size: number;
  color: string;
};

export function AppIcon({ icon, size, color }: AppIconProps) {
  return (
    <SymbolView name={{ ios: icon.sf, android: icon.md, web: icon.md }} size={size} tintColor={color} />
  );
}
