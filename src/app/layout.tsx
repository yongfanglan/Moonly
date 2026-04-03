import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moonly - Your AI Emotional Companion",
  description: "让每一个孤独的深夜，都有人陪伴. An AI emotional companion for those lonely nights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark">
        {children}
      </body>
    </html>
  );
}
