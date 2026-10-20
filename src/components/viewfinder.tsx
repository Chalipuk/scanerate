import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';
import type { Rect } from '@/utils/scan-result';

const GRID = ['25%', '50%', '75%'] as const;

// เส้นสแกนวิ่งขึ้นลง (Reanimated 4 CSS animation — ใช้ได้ทั้งมือถือและเว็บ)
const scanAnimation = {
  animationName: { from: { top: '12%' }, to: { top: '88%' } },
  animationDuration: '2.4s',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
  animationTimingFunction: 'ease-in-out',
} as const;

// มุมกรอบวิ่งไปล็อกโค้ดแบบเด้งนิด ๆ
// cast เป็น ViewStyle: type ของ Reanimated ยังไม่รับ cubicBezier() ใน style array (ตอนรันใช้ได้ตามเอกสาร)
const snapTransition = {
  transitionProperty: ['left', 'top'],
  transitionDuration: 420,
  transitionTimingFunction: cubicBezier(0.34, 1.56, 0.64, 1),
} as unknown as ViewStyle;

const fadeTransition = { transitionProperty: 'opacity', transitionDuration: 250 } as const;

type ViewfinderProps = {
  /** ภาพกล้อง หรือข้อความตรงกลางกรอบ */
  children?: ReactNode;
  /** แสดงเส้นสแกนวิ่ง */
  scanning?: boolean;
  /** แสดงเส้นตาราง (ตอนยังไม่มีภาพกล้อง) */
  grid?: boolean;
  /** สแกนติดแล้ว: มุมกรอบวิ่งไปครอบโค้ด */
  locked?: boolean;
  /** ตำแหน่งโค้ดในกรอบ — ไม่มีหรือหลุดกรอบ = ล็อกตรงกลาง */
  lockBounds?: Rect;
};

const INSET = 20;
const CORNER_SIZE = 40;
const CORNER_WIDTH = 3;
const CORNER_RADIUS = 14;

/** หากรอบที่มุมทั้ง 4 ควรอยู่ */
function targetBox(size: number, locked: boolean, bounds?: Rect): Rect {
  if (!locked) {
    return { x: INSET, y: INSET, width: size - INSET * 2, height: size - INSET * 2 };
  }
  const pad = 12;
  const valid =
    bounds &&
    bounds.width >= 40 &&
    bounds.x >= 0 &&
    bounds.y >= 0 &&
    bounds.x + bounds.width <= size &&
    bounds.y + bounds.height <= size;
  if (valid) {
    return {
      x: Math.max(4, bounds.x - pad),
      y: Math.max(4, bounds.y - pad),
      width: Math.min(size - 8, bounds.width + pad * 2),
      height: Math.min(size - 8, bounds.height + pad * 2),
    };
  }
  const inset = size * 0.22;
  return { x: inset, y: inset, width: size - inset * 2, height: size - inset * 2 };
}

/** กรอบเล็งกล้อง: มุมสีฟ้า 4 มุม + เส้นสแกน วางทับบนภาพกล้องหรือข้อความ */
export function Viewfinder({
  children,
  scanning = false,
  grid = false,
  locked = false,
  lockBounds,
}: ViewfinderProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState(0);

  const box = targetBox(size, locked, lockBounds);
  const right = box.x + box.width - CORNER_SIZE;
  const bottom = box.y + box.height - CORNER_SIZE;
  const corners = [
    { key: 'tl', left: box.x, top: box.y, style: styles.topLeft },
    { key: 'tr', left: right, top: box.y, style: styles.topRight },
    { key: 'bl', left: box.x, top: bottom, style: styles.bottomLeft },
    { key: 'br', left: right, top: bottom, style: styles.bottomRight },
  ];

  return (
    <View
      onLayout={(event) => setSize(event.nativeEvent.layout.width)}
      style={[styles.frame, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {grid
        ? GRID.map((position) => (
            <View key={position} pointerEvents="none" style={StyleSheet.absoluteFill}>
              <View style={[styles.gridLineV, { left: position, backgroundColor: theme.border }]} />
              <View style={[styles.gridLineH, { top: position, backgroundColor: theme.border }]} />
            </View>
          ))
        : null}

      {children}

      <Animated.View
        pointerEvents="none"
        style={[styles.dim, { opacity: locked ? 1 : 0 }, fadeTransition]}
      />

      {size > 0
        ? corners.map(({ key, left, top, style }) => (
            <Animated.View
              key={key}
              pointerEvents="none"
              style={[
                styles.corner,
                style,
                { left, top, borderColor: theme.accent },
                !reduceMotion && snapTransition,
              ]}
            />
          ))
        : null}

      {scanning && !locked ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.scanLine,
            { backgroundColor: theme.accent, boxShadow: `0 0 16px 2px ${theme.accent}` },
            !reduceMotion && scanAnimation,
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: CORNER_RADIUS,
  },
  topRight: {
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: CORNER_RADIUS,
  },
  bottomLeft: {
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  bottomRight: {
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: CORNER_RADIUS,
  },
  scanLine: {
    position: 'absolute',
    top: '12%',
    left: INSET + 8,
    right: INSET + 8,
    height: 2,
    borderRadius: 1,
  },
});
