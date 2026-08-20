import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://robsense.id"),
  title: "RobSense | Peringatan Dini Banjir Rob",
  description: "Platform cerdas pemantauan risiko banjir rob dan konservasi air tanah secara real-time. Lindungi wilayah Anda dari ancaman penurunan muka tanah.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "RobSense | Peringatan Dini Banjir Rob",
    description: "Platform cerdas peringatan dini banjir rob berbasis data cuaca, pasang surut, dan pemetaan penggunaan air tanah secara real-time.",
    url: "https://robsense.id",
    siteName: "RobSense",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 600,
        alt: "RobSense Logo Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RobSense | Pantau Risiko Banjir Rob",
    description: "Sistem cerdas peringatan dini banjir rob berbasis analisis data.",
    images: ["/logo.jpeg"],
  },
};

export const viewport = {
  themeColor: '#254B94',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">{children}</body>
    </html>
  );
}
