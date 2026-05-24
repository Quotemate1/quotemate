import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "./components/FeedbackWidget";
import PostHogProvider from "./components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smokohq.app'),
  title: {
    default: "SmokoHQ — AI Quotes for Aussie Tradies",
    template: "%s | SmokoHQ",
  },
  description: "You take your smoko. We'll handle the quotes. AI-powered quoting, auto follow-ups, and quote tracking for Australian tradies. Free during beta.",
  keywords: [
    "AI quoting software",
    "quoting tool for tradies",
    "tradies quoting app",
    "Australian tradies",
    "quote generator",
    "tradie business software",
    "plumber quoting",
    "electrician quoting",
    "builder quoting",
    "follow up customers",
    "GST quotes",
    "tradie SaaS",
    "smoko",
  ],
  authors: [{ name: "SmokoHQ" }],
  creator: "SmokoHQ",
  publisher: "SmokoHQ",
  applicationName: "SmokoHQ",
  category: "Business Software",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://smokohq.app",
    siteName: "SmokoHQ",
    title: "SmokoHQ — AI Quotes for Aussie Tradies",
    description: "You take your smoko. We'll handle the quotes. AI-powered quoting in 60 seconds, auto follow-ups, and quote tracking. Built for Australian tradies. Free during beta.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmokoHQ — AI Quotes for Aussie Tradies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmokoHQ — AI Quotes for Aussie Tradies",
    description: "AI quoting in 60 seconds. Auto follow-ups. Built for Aussie tradies. Free during beta.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://smokohq.app/#software",
                  "name": "SmokoHQ",
                  "description": "AI-powered quoting software for Australian tradies. Write professional quotes in 60 seconds, auto follow-up customers, and track quote responses.",
                  "url": "https://smokohq.app",
                  "applicationCategory": "BusinessApplication",
                  "applicationSubCategory": "Quoting Software",
                  "operatingSystem": "Web",
                  "offers": [
                    {
                      "@type": "Offer",
                      "name": "Starter",
                      "price": "59",
                      "priceCurrency": "AUD",
                      "description": "20 AI quotes per month with GST handling and customer email delivery"
                    },
                    {
                      "@type": "Offer",
                      "name": "Pro",
                      "price": "99",
                      "priceCurrency": "AUD",
                      "description": "Unlimited AI quotes with auto follow-ups and analytics"
                    }
                  ],
                  "featureList": [
                    "AI-powered quote generation in 60 seconds",
                    "Automatic GST calculation",
                    "Customer accept/decline emails",
                    "Auto follow-up at 48 hours and 5 days",
                    "Quote tracking dashboard",
                    "Market price check",
                    "Saved line items and templates"
                  ],
                  "publisher": {
                    "@id": "https://smokohq.app/#organization"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://smokohq.app/#organization",
                  "name": "SmokoHQ",
                  "url": "https://smokohq.app",
                  "logo": "https://smokohq.app/og-image.png",
                  "description": "Australian software company building tools for tradies.",
                  "foundingDate": "2026",
                  "areaServed": {
                    "@type": "Country",
                    "name": "Australia"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "support@smokohq.app",
                    "contactType": "customer support",
                    "availableLanguage": "English",
                    "areaServed": "AU"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://smokohq.app/#website",
                  "url": "https://smokohq.app",
                  "name": "SmokoHQ",
                  "publisher": {
                    "@id": "https://smokohq.app/#organization"
                  },
                  "inLanguage": "en-AU"
                }
              ]
            })
          }}
        />
        <PostHogProvider>
          {children}
          <FeedbackWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}