import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peony HQ Kenya | Elegant Jewellery",
  description: "Discover beautiful, handcrafted jewellery at Peony HQ Kenya. Shop our collection of earrings, necklaces, rings, and bracelets.",
  keywords: ["jewellery", "Kenya", "earrings", "necklaces", "rings", "bracelets", "Peony HQ"],
  icons: {
    icon: "/peony-tab.svg",
    shortcut: "/peony-tab.svg",
    apple: "/peony-tab.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
