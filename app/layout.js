import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/SiteNav";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "2776",
  description: "2776 crafts sleek, premium web experiences that elevate your brand and deliver results.",
  openGraph: {
    title: "2776 — Sleek. Premium. Web Experiences.",
    description: "Fast, elegant websites that elevate your brand.",
    url: "https://2776.ltd",
    siteName: "2776",
    images: [{ url: "https://2776.ltd/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2776 — Sleek. Premium. Web Experiences.",
    description: "Fast, elegant websites that elevate your brand.",
    images: ["https://2776.ltd/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <html lang="en">
        <body className="min-h-screen bg-black text-white selection:bg-white/90 selection:text-black">
          <SiteNav />
          {children}
          <SiteFooter />
        </body>
      </html>
    </html>
  );
}
