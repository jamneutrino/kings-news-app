import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kings News App',
  description: 'Latest news and updates about the Sacramento Kings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 