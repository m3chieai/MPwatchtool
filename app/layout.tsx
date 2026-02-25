import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Master Piece - Luxury Watch Marketplace',
  description: 'Get instant, guaranteed quotes for your luxury watches. No auctions. No waiting. No lowball offers.',
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
