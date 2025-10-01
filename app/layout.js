import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sleek. Premium. Web Experiences | 2776",
  description: "2776 crafts fast, elegant websites that elevate your brand, boost SEO, and deliver results.",
  openGraph: {
    title: "2776 | Sleek. Premium. Web Experiences",
    description: "2776 crafts fast, elegant websites that elevate your brand, boost SEO, and deliver results.",
    url: "https://2776.ltd",
    siteName: "2776",
    images: [{ url: "/logo.png", width: 800, height: 600 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2776 | Sleek. Premium. Web Experiences",
    description: "Fast, elegant websites that elevate your brand and deliver results.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
