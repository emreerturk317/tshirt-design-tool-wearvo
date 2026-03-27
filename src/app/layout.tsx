import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";
import SaleNotification from "@/components/SaleNotification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wearvo — Designed by you. Worn by the world.",
  description: "Create AI-powered t-shirt designs and earn passive income every time someone buys your art.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-black">
        <AppProvider>
          <Navbar />
          <SaleNotification />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
