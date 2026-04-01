import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moonly - Your AI Emotional Companion",
  description: "A warm AI companion for lonely nights. 7x24 emotional support, mood check-ins, and genuine connection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌙</text></svg>" />
      </head>
      <body className="dark">
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
