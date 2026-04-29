import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kevin Hannigan — Interactive Resume',
  description:
    'A Game Boy–inspired interactive portfolio walking through Kevin Hannigan\'s career in systems engineering, ERP implementation, consulting, and finance applications leadership.',
  keywords: [
    'Kevin Hannigan',
    'interactive resume',
    'portfolio',
    'systems engineering',
    'finance applications',
    'product management',
  ],
  openGraph: {
    title: 'Kevin Hannigan — Interactive Resume',
    description:
      'Walk through Kevin\'s career journey in a retro Game Boy-style adventure.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[--gb-darkest] text-[--gb-lightest] antialiased">
        {children}
      </body>
    </html>
  );
}
