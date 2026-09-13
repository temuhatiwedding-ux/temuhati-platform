import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Setup font Quicksand
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
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
      className={`${quicksand.variable} h-full antialiased`}
    >
      {/* Tambahkan font-sans dan warna background/teks dari logo di body */}
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBF9] text-[#3A4B40]">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}