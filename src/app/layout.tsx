import type { Metadata } from "next";
import { Space_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { QuizPopup } from "@/components/layout/QuizPopup";
import { PopupManager } from "@/components/layout/PopupManager";
import { RecentPurchaseToast } from "@/components/layout/RecentPurchaseToast";
import { AgeGate } from "@/components/layout/AgeGate";
import { CartProvider } from "@/lib/cart-context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: "ALTR — The Standard. Not the Markup.",
  description: "Premium research compounds. Without the premium markup. Independently tested, every batch.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" />
      </head>
      <body className="flex min-h-full flex-col bg-ivory text-charcoal">
        <CartProvider>
          <AgeGate>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 pt-[90px] md:pt-[100px]">{children}</main>
            <Footer />
            <CartDrawer />
            <QuizPopup />
            <PopupManager />
            <RecentPurchaseToast />
          </AgeGate>
        </CartProvider>
      </body>
    </html>
  );
}
