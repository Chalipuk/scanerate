import { CameraView, useCameraPermissions, type BarcodeScanningResult, type BarcodeType } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';

import type { IconName } from './app-icon';
import { Button } from './button';
import { EmptyState } from './empty-state';
import { Viewfinder } from './viewfinder';

import type { ScanResult } from '@/utils/scan-result';

export const BARCODE_TYPES: BarcodeType[] = [
  'qr',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'pdf417',
  'datamatrix',
  'aztec',
  'itf14',
  'codabar',
];

const CameraIcon: IconName = { sf: 'camera.fill', md: 'photo_camera' };
const SettingsIcon: IconName = { sf: 'gearshape', md: 'settings' };

type ScannerProps = {
  onScan: (result: ScanResult) => void;
  /** มีผลสแกนค้างอยู่: หยุดภาพ + ล็อกมุมกรอบไว้ที่โค้ด */
  locked: boolean;
  lockBounds?: ScanResult['bounds'];
};

/** กล้องสแกน QR / Barcode — ขออนุญาตใช้กล้องก่อน แล้วส่งผลแรกที่เจอกลับไปทาง onScan */
export function Scanner({ onScan, locked, lockBounds }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraError, setCameraError] = useState<string | null>(null);
  // ปิดกล้องตอนสลับไปแท็บอื่น (แท็บยังไม่ถูกทำลาย กล้องจะค้างเปิดอยู่)
  const isFocused = useIsFocused();
  // กล้องส่งผลมาหลายครั้งต่อวินาที — รับแค่ครั้งแรก
  const scannedRef = useRef(false);
  const cameraRef = useRef<CameraView>(null);
  const pausedRef = useRef(false);

  // กด Scan again (locked กลับเป็น false) = ปล่อยภาพให้เดินต่อ และรับผลใหม่ได้
  useEffect(() => {
    if (locked) return;
    scannedRef.current = false;
    if (pausedRef.current) {
      pausedRef.current = false;
      cameraRef.current?.resumePreview().catch(() => {});
    }
  }, [locked]);

  const handleScanned = ({ type, data, bounds }: BarcodeScanningResult) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    pausedRef.current = true;
    cameraRef.current?.pausePreview().catch(() => {});
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    onScan({
      type,
      data,
      bounds: bounds && {
        x: bounds.origin.x,
        y: bounds.origin.y,
        width: bounds.size.width,
        height: bounds.size.height,
      },
    });
  };

  if (!permission) {
    return <Viewfinder grid locked={locked} />;
  }

  // เบราว์เซอร์เปิดกล้องได้เฉพาะ https หรือ localhost
  const insecureWeb = Platform.OS === 'web' && !window.isSecureContext;

  if (cameraError || insecureWeb) {
    return (
      <Viewfinder grid locked={locked}>
        <EmptyState
          icon={CameraIcon}
          title="Camera unavailable"
          message={
            insecureWeb
              ? 'The camera only works on a secure (https) connection.'
              : (cameraError ?? 'The camera could not be started.')
          }
          style={styles.message}
        />
      </Viewfinder>
    );
  }

  if (!permission.granted) {
    const blocked = !permission.canAskAgain;
    return (
      <Viewfinder grid locked={locked}>
        <EmptyState
          icon={CameraIcon}
          title={blocked ? 'Camera access is off' : 'Allow camera access'}
          message={
            blocked
              ? Platform.OS === 'web'
                ? 'Turn on camera access for this site in your browser settings.'
                : 'Turn on camera access for this app in Settings.'
              : 'The camera is only used to read codes. Nothing is recorded or uploaded.'
          }
          style={styles.message}>
          {blocked ? (
            Platform.OS !== 'web' ? (
              <Button label="Open settings" icon={SettingsIcon} onPress={() => Linking.openSettings()} />
            ) : null
          ) : (
            <Button label="Enable camera" icon={CameraIcon} onPress={requestPermission} />
          )}
        </EmptyState>
      </Viewfinder>
    );
  }

  return (
    <Viewfinder scanning={isFocused} locked={locked} lockBounds={lockBounds}>
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
          onBarcodeScanned={locked ? undefined : handleScanned}
          onMountError={({ message }) => setCameraError(message)}
        />
      ) : null}
    </Viewfinder>
  );
}

const styles = StyleSheet.create({
  message: {
    ...StyleSheet.absoluteFill,
    borderWidth: 0,
  },
});
