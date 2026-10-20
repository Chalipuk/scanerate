import type { Metadata } from 'expo-router/server';

export const Site = {
  name: 'Scanerate',
  description:
    'Free QR code and barcode scanner & generator that runs in your browser. See the link before it opens, create QR codes for links, Wi-Fi, contacts and text, and download them as PNG or SVG.',
  author: 'Chalipuk',
  /** โดเมนจริงตอน deploy เช่น EXPO_PUBLIC_SITE_URL=https://scanerate.vercel.app (ยังไม่ตั้ง = ไม่ใส่ canonical) */
  url: process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, ''),
  ogImage: { path: '/og.png', width: 1200, height: 630 },
  keywords: [
    'QR code scanner',
    'barcode scanner',
    'QR code generator',
    'barcode generator',
    'scan QR online',
    'Wi-Fi QR code',
    'vCard QR code',
  ],
};

const absolute = (path: string) => (Site.url ? `${Site.url}${path}` : path);

type PageMeta = {
  /** ชื่อหน้าเต็ม (ใส่ชื่อแอปเองถ้าต้องการ) */
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

/** meta ของแต่ละหน้า สำหรับ generateMetadata() — ฝังลง HTML ตอน render ล่วงหน้า */
export function pageMetadata({ title, description, path, noIndex }: PageMeta): Metadata {
  const image = {
    url: absolute(Site.ogImage.path),
    width: Site.ogImage.width,
    height: Site.ogImage.height,
    alt: `${Site.name} — scan & generate QR codes and barcodes`,
  };

  return {
    title,
    description,
    applicationName: Site.name,
    authors: { name: Site.author },
    creator: Site.author,
    keywords: Site.keywords,
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    alternates: Site.url ? { canonical: absolute(path) } : undefined,
    openGraph: {
      type: 'website',
      siteName: Site.name,
      locale: 'en_US',
      title,
      description,
      url: Site.url ? absolute(path) : undefined,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      apple: '/apple-touch-icon.png',
    },
    appleWebApp: { title: Site.name, statusBarStyle: 'black-translucent' },
    formatDetection: { telephone: false, email: false, address: false },
  };
}
