import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "塔罗占卜",
  description: "写下你的问题，洗牌，翻开属于你的牌",
  applicationName: "塔罗占卜",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "塔罗",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0f2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
