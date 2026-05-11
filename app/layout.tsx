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
  title: "SmokoHQ — AI Quotes for Aussie Tradies",
  description: "You take your smoko. We'll handle the quotes. AI-powered quoting, auto follow-ups, and quote tracking for Australian tradies.",
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
        <PostHogProvider>
          {children}
          <FeedbackWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}