export type Rect = { x: number; y: number; width: number; height: number };

export type ScanResult = {
  /** ชนิดโค้ดจาก expo-camera เช่น 'qr', 'ean13' */
  type: string;
  data: string;
  /** ตำแหน่งโค้ดในภาพกล้อง (ไม่มีถ้าสแกนจากรูป) */
  bounds?: Rect;
};

export type Safety = 'safe' | 'caution' | 'danger';

export type ScanAnalysis =
  | { kind: 'url'; url: string; host: string; safety: Safety; warnings: string[] }
  | { kind: 'blocked'; text: string; safety: 'danger'; warnings: string[] }
  | { kind: 'text'; text: string };

// บริการย่อลิงก์ยอดนิยม — ปลายทางจริงถูกซ่อน
const SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'cutt.ly',
  'rebrand.ly',
  'shorturl.at',
  'rb.gy',
  'tiny.cc',
  's.id',
  't.ly',
  'lnkd.in',
]);

const SCRIPT_SCHEME = /^(javascript|data|vbscript|file):/i;
const WEB_URL = /^(https?):\/\/([^/?#\s]+)/i;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const NON_ASCII = /[^ -~]/;

/** แยกว่าผลสแกนเป็นลิงก์หรือข้อความ และหาสัญญาณที่น่าสงสัยของลิงก์ (ตรวจเบื้องต้นในเครื่อง ไม่ได้ส่งไปเช็กที่ไหน) */
export function analyzeScan(raw: string): ScanAnalysis {
  const data = raw.trim();

  if (SCRIPT_SCHEME.test(data)) {
    return {
      kind: 'blocked',
      text: data,
      safety: 'danger',
      warnings: ['Tries to run code or open a local file — opening is blocked'],
    };
  }

  const url = /^www\./i.test(data) ? `https://${data}` : data;
  const match = WEB_URL.exec(url);
  if (!match) {
    return { kind: 'text', text: data };
  }

  const scheme = match[1].toLowerCase();
  const authority = match[2];
  const host = authority
    .slice(authority.lastIndexOf('@') + 1)
    .replace(/:\d+$/, '')
    .replace(/^\[|\]$/g, '')
    .toLowerCase();

  const warnings: string[] = [];
  if (scheme === 'http') {
    warnings.push('Not encrypted — uses http instead of https');
  }
  if (authority.includes('@')) {
    warnings.push('Contains “@”, which can hide the real address');
  }
  if (IPV4.test(host) || host.includes(':')) {
    warnings.push('Goes to a raw IP address instead of a domain');
  }
  if (host.split('.').some((label) => label.startsWith('xn--')) || NON_ASCII.test(host)) {
    warnings.push('Domain uses look-alike characters');
  }
  if (SHORTENERS.has(host.replace(/^www\./, ''))) {
    warnings.push('Short link — the final destination is hidden');
  }

  return { kind: 'url', url, host, safety: warnings.length > 0 ? 'caution' : 'safe', warnings };
}

const BarcodeLabels: Record<string, string> = {
  qr: 'QR code',
  ean13: 'EAN-13',
  ean8: 'EAN-8',
  upc_a: 'UPC-A',
  upc_e: 'UPC-E',
  code128: 'Code 128',
  code39: 'Code 39',
  code93: 'Code 93',
  pdf417: 'PDF417',
  datamatrix: 'Data Matrix',
  aztec: 'Aztec',
  itf14: 'ITF-14',
  codabar: 'Codabar',
};

// บางครั้ง Android ส่งชนิดโค้ดมาเป็นตัวเลขของ ML Kit แทนชื่อ
const MlKitFormats: Record<number, string> = {
  1: 'code128',
  2: 'code39',
  4: 'code93',
  8: 'codabar',
  16: 'datamatrix',
  32: 'ean13',
  64: 'ean8',
  128: 'itf14',
  256: 'qr',
  512: 'upc_a',
  1024: 'upc_e',
  2048: 'pdf417',
  4096: 'aztec',
};

export function barcodeLabel(type: string | number) {
  const key = typeof type === 'number' ? (MlKitFormats[type] ?? String(type)) : String(type ?? '');
  return BarcodeLabels[key] ?? (key.toUpperCase() || 'Code');
}
