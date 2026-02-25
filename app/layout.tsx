import type { Metadata } from "next";
import { Playfair_Display, Lato, Inter } from "next/font/google"; // Added Inter
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glamoora - Eligible Event Planning",
  description: "A smart, budget-friendly event planning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-alabaster font-sans antialiased",
          inter.variable, // Added Inter variable
          playfair.variable,
          lato.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
