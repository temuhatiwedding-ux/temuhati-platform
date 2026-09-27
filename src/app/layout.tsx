import type { Metadata } from "next";
import { Quicksand, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Setup font Quicksand
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

// Setup font Playfair Display untuk gaya serif mewah/editorial
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Temuhati - Undangan Digital",
  description: "Buat undangan pernikahan digitalmu dengan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${quicksand.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBF9] text-[#3A4B40]">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}