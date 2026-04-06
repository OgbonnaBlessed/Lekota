import ReduxProvider from "@/components/providers/ReduxProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lekota",
  description: "Multi-Tenant Schedule Management System",
  openGraph: {
    title: "Lekota",
    description: "Multi-Tenant Schedule Management System",
    url: "https://lekota-gules.vercel.app/",
    siteName: "OVCN",
    images: [
      {
        url: "https://lekota-gules.vercel.app/banner.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lekota",
    description: "Multi-Tenant Schedule Management System",
    images: ["https://lekota-gules.vercel.app/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-full h-full flex items-center justify-center`}
      >
        <ReduxProvider>
          <Toaster position="bottom-right" closeButton />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
