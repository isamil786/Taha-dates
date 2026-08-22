import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taha Dates & Nuts | Great Taste In Every Bite",
  description:
    "Premium Dates, Nuts, Healthy Delights & Imported Chocolates. Scan our QR menu to browse prices.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Taha Dates",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable}`}>
      <body className="min-h-screen bg-[#FAF8F5] font-sans text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
