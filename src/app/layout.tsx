import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminModeProvider } from "@/contexts/AdminModeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminCustomerModeBanner from "@/components/admin/AdminCustomerModeBanner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Peony HQ Kenya | Elegant Jewellery",
  description: "Discover beautiful, handcrafted jewellery at Peony HQ Kenya. Shop our collection of earrings, necklaces, rings, bracelets, and jewellery sets.",
  keywords: ["jewellery", "Kenya", "earrings", "necklaces", "rings", "bracelets", "jewellery sets", "Peony HQ"],
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
        className={`${outfit.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AdminModeProvider>
              <CartProvider>
                <WishlistProvider>
                  <AdminCustomerModeBanner />
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </AdminModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
