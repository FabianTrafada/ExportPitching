import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExportPitch AI | AI-Powered Export Pitching Training Platform",
  description:
    "AI-powered pitching training platform helping Indonesian exporters succeed in global markets. Get personalized feedback and cultural insights to enhance your international presentation skills.",
  keywords:
    "export training, Indonesian exports, AI pitch training, international sales, export pitch, global market entry, pitching training, Indonesian exports, international market, export negotiation, international business language",
  authors: [{ name: "ExportPitch AI" }],
  creator: "ExportPitch AI",
  publisher: "ExportPitch AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://exportpitch.ai",
    title: "ExportPitch AI | AI-Powered Export Pitching Training Platform",
    description:
      "AI-powered pitching training platform helping Indonesian exporters succeed in global markets. Get personalized feedback and cultural insights to enhance your international presentation skills.",
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
    title: "ExportPitch AI | AI-Powered Export Pitching Training Platform",
    description:
      "AI-powered pitching training platform helping Indonesian exporters succeed in global markets. Get personalized feedback and cultural insights.",
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
      "id-ID": "https://exportpitch.ai/id",
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
          <body className={`${inter.className} antialiased`}>
            <ThemeProvider
              attribute={"class"}
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <SpeedInsights />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
