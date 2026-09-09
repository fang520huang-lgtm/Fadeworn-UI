import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wear UI — 界面使用实验室",
  description: "一个由真实交互留下磨损、摩擦与使用历史的界面实验。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
