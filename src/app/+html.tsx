import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { Palette } from '@/constants/palette';
import { Site } from '@/constants/site';

// HTML รากของทุกหน้าบนเว็บ (ใช้ตอน render ล่วงหน้าเท่านั้น ไม่ได้รันในเบราว์เซอร์)
// meta ของแต่ละหน้า (title / description / Open Graph) มาจาก generateMetadata() ในไฟล์หน้านั้น ๆ ผ่าน headNodes

const cssVars = (scheme: keyof typeof Palette) =>
  Object.entries(Palette[scheme])
    .map(([key, value]) => `--color-${key}:${value};`)
    .join('');

const themeCss = `
:root{color-scheme:light;${cssVars('light')}}
@media (prefers-color-scheme: dark){:root{color-scheme:dark;${cssVars('dark')}}}
html,body{background-color:var(--color-background);}
body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
::selection{background-color:var(--color-accentMuted);}
`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: Site.name,
  description: Site.description,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web, Android, iOS',
  browserRequirements: 'Requires JavaScript. Scanning needs a camera.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: Site.author },
  ...(Site.url ? { url: Site.url } : {}),
};

export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={Palette.light.background}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={Palette.dark.background}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap"
        />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
