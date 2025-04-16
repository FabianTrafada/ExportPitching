import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExportPitch AI | Pitching Training for Indonesian Exporters",
  description:
    "AI-powered pitching training platform helping Indonesian exporters succeed in global markets with personalized feedback and cultural insights.",
  keywords:
    "export training, Indonesian exports, AI pitch training, international sales, export pitch, global market entry",
  authors: [{ name: "ExportPitch AI" }],
  creator: "ExportPitch AI",
  publisher: "ExportPitch AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://exportpitch.ai",
    title: "ExportPitch AI | Pitching Training for Indonesian Exporters",
    description:
      "AI-powered pitching training platform helping Indonesian exporters succeed in global markets with personalized feedback and cultural insights.",
    siteName: "ExportPitch AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ExportPitch AI - Master Your Export Pitch With AI Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExportPitch AI | Pitching Training for Indonesian Exporters",
    description:
      "AI-powered pitching training platform helping Indonesian exporters succeed in global markets with personalized feedback and cultural insights.",
    images: ["/twitter-image.jpg"],
    creator: "@exportpitchai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://exportpitch.ai",
    languages: {
      "en-US": "https://exportpitch.ai",
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute={"class"} defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
