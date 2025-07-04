import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = localFont({
  src: [
    {
      path: "../../public/Orbitron/static/Orbitron-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Orbitron/static/Orbitron-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/Orbitron/static/Orbitron-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Orbitron/static/Orbitron-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/Orbitron/static/Orbitron-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/Orbitron/static/Orbitron-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Formula1.ai - F1 Drivers & Teams",
  description: "Explore Formula 1 drivers and teams with live data from OpenF1 API and professional driver headshots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
