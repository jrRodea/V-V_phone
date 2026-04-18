import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "V&V Phone — Teléfonos de segunda mano",
    template: "%s | V&V Phone",
  },
  description:
    "Encuentra tu próximo teléfono en V&V Phone. La mejor selección de smartphones usados con garantía de calidad.",
  openGraph: {
    siteName: "V&V Phone",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" className={inter.variable}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
