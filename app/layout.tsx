import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/providers/toast-provider";
import { ModalProvider } from "@/providers/modal-provider";
//import BcModalProvider from "@/providers/bcModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neighbor App",
  description: "A mega social application for connecting neighbors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
      <body className={inter.className}>
          <ToastProvider/>
          <ModalProvider/>
          {children}
      </body>
      </SessionProvider>
    </html>
  );
}
