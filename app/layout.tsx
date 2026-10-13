import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PulseTrack • Full-Stack Issue Tracker',
  description: 'A modern, full-stack issue and bug tracker built with Next.js App Router and TypeScript.',
  icons: {
    icon: 'https://cdn.freecodecamp.org/universal/favicons/favicon-16x16.png'
  }
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
