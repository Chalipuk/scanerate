import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanResultCard } from './scan-result-card';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ScanResult } from '@/utils/scan-result';

const slideUp = {
  animationName: { from: { transform: [{ translateY: 420 }] }, to: { transform: [{ translateY: 0 }] } },
  animationDuration: '380ms',
  animationTimingFunction: cubicBezier(0.22, 1, 0.36, 1),
} as const;

type ScanSheetProps = {
  result: ScanResult | null;
  /** ปิดแผ่น = สแกนใหม่ */
  onClose: () => void;
};

/** แผ่นผลสแกนที่เลื่อนขึ้นจากด้านล่าง ทับภาพกล้องที่หยุดไว้ */
export function ScanSheet({ result, onClose }: ScanSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={result !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      {result ? (
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              paddingBottom: insets.bottom + Spacing.three,
            },
            slideUp,
          ]}>
          <View style={[styles.grabber, { backgroundColor: theme.backgroundSelected }]} />
          <ScanResultCard result={result} onScanAgain={onClose} style={styles.card} />
        </Animated.View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 560,
    marginHorizontal: 'auto',
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  card: {
    borderWidth: 0,
  },
});
