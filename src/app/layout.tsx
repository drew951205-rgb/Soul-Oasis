import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppNav } from "@/components/app-nav";
import { AppFooter } from "@/components/app-footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soul Oasis 心靈綠洲",
  description: "一個溫柔、穩定、可靠的情緒陪伴與自我整理空間。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppNav />
        <div className="min-h-[calc(100vh-8rem)]">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
