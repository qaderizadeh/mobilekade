import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "موبایلکده | فروشگاه لوازم جانبی موبایل",
    template: "%s | موبایلکده",
  },
  description:
    "خرید آنلاین لوازم جانبی موبایل: قاب، گلس، شارژر، پاوربانک، هندزفری و بیشتر — با ارسال سریع و ضمانت اصالت کالا.",
  keywords: [
    "لوازم جانبی موبایل",
    "قاب گوشی",
    "گلس",
    "شارژر",
    "پاوربانک",
    "هندزفری",
    "فروشگاه اینترنتی",
  ],
  applicationName: "موبایلکده",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#3358f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col bg-surface-2 text-ink-900">
        {children}
      </body>
    </html>
  );
}
