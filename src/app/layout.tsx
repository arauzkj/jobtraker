import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000",
);
const siteName = "Trayecto";
const description =
  "Organiza y da seguimiento a tus postulaciones de trabajo en un solo lugar.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: {
    default: "Trayecto — Job Tracker",
    template: "%s | Trayecto",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: "/",
    siteName,
    title: "Trayecto — Job Tracker",
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1918,
        height: 943,
        alt: "Trayecto, tu panel para dar seguimiento a postulaciones de trabajo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trayecto — Job Tracker",
    description,
    images: [
      {
        url: "/og-image.png",
        alt: "Trayecto, tu panel para dar seguimiento a postulaciones de trabajo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`light ${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
