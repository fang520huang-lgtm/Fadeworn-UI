import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wear UI — UI Aging Laboratory",
  description: "An interface experiment where real interaction leaves wear, friction, and a visible history.",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
