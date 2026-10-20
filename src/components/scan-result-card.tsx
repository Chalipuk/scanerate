import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type IconName } from './app-icon';
import { Button } from './button';
import { ThemedText } from './themed-text';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { analyzeScan, barcodeLabel, type Safety, type ScanResult } from '@/utils/scan-result';

const Icons = {
  open: { sf: 'arrow.up.right.square', md: 'open_in_new' },
  copy: { sf: 'doc.on.doc', md: 'content_copy' },
  copied: { sf: 'checkmark', md: 'check' },
  again: { sf: 'arrow.clockwise', md: 'refresh' },
  safe: { sf: 'checkmark.shield.fill', md: 'verified_user' },
  caution: { sf: 'exclamationmark.triangle.fill', md: 'warning' },
  danger: { sf: 'xmark.octagon.fill', md: 'dangerous' },
} satisfies Record<string, IconName>;

const SafetyLabels: Record<Safety, string> = {
  safe: 'No red flags',
  caution: 'Be careful',
  danger: 'Blocked',
};

type ScanResultCardProps = {
  result: ScanResult;
  onScanAgain: () => void;
  style?: StyleProp<ViewStyle>;
};

/** ผลสแกน: โชว์ปลายทางของลิงก์ + คำเตือนก่อนให้กดเปิด */
export function ScanResultCard({ result, onScanAgain, style }: ScanResultCardProps) {
  const theme = useTheme();
  const analysis = analyzeScan(result.data);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const tones = {
    safe: { color: theme.success, background: theme.successMuted },
    caution: { color: theme.warning, background: theme.warningMuted },
    danger: { color: theme.danger, background: theme.dangerMuted },
  };
  const tone = analysis.kind === 'text' ? null : tones[analysis.safety];
  const copyText = analysis.kind === 'url' ? analysis.url : analysis.text;

  const copy = async () => {
    await Clipboard.setStringAsync(copyText);
    setCopied(true);
  };

  return (
    <View
      style={[styles.card, { borderColor: theme.border, backgroundColor: theme.background }, style]}>
      <View style={styles.top}>
        <ThemedText type="eyebrow" themeColor="textSecondary">
          {barcodeLabel(result.type)}
        </ThemedText>
        {tone && analysis.kind !== 'text' ? (
          <View style={[styles.badge, { backgroundColor: tone.background }]}>
            <AppIcon icon={Icons[analysis.safety]} size={14} color={tone.color} />
            <ThemedText type="smallBold" style={[styles.badgeText, { color: tone.color }]}>
              {SafetyLabels[analysis.safety]}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {analysis.kind === 'url' ? (
        <View style={styles.body}>
          <ThemedText style={styles.host} numberOfLines={1}>
            {analysis.host}
          </ThemedText>
          <ThemedText type="code" themeColor="textSecondary" selectable numberOfLines={3}>
            {analysis.url}
          </ThemedText>
        </View>
      ) : (
        <ThemedText selectable style={styles.text}>
          {analysis.text}
        </ThemedText>
      )}

      {tone && analysis.kind !== 'text' && analysis.warnings.length > 0 ? (
        <View style={[styles.warnings, { backgroundColor: tone.background }]}>
          {analysis.warnings.map((warning) => (
            <View key={warning} style={styles.warningRow}>
              <AppIcon icon={Icons[analysis.safety]} size={14} color={tone.color} />
              <ThemedText type="small" style={[styles.warningText, { color: tone.color }]}>
                {warning}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        {analysis.kind === 'url' ? (
          <Button
            label={analysis.safety === 'safe' ? 'Open link' : 'Open anyway'}
            icon={Icons.open}
            onPress={() => Linking.openURL(analysis.url)}
          />
        ) : null}
        <Button
          variant="secondary"
          label={copied ? 'Copied' : 'Copy'}
          icon={copied ? Icons.copied : Icons.copy}
          onPress={copy}
        />
        <Button variant="secondary" label="Scan again" icon={Icons.again} onPress={onScanAgain} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.four - 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    gap: Spacing.one,
  },
  host: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 600,
    letterSpacing: -0.4,
  },
  text: {
    fontSize: 17,
    lineHeight: 26,
  },
  warnings: {
    gap: Spacing.two,
    padding: Spacing.three - 4,
    borderRadius: 12,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  warningText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
