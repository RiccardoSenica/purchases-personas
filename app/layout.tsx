import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Purchases Consumers',
  description:
    'Generate realistic synthetic consumers and their weekly purchase behaviors using AI'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
