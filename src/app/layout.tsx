import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PropelAI Realty OS",
    template: "%s | PropelAI Realty OS",
  },
  description:
    "The AI-powered multi-tenant CRM built for modern real estate teams. Manage leads, properties, staff, and AI calls from one unified platform.",
  keywords: ["real estate CRM", "AI calling", "lead management", "property management", "realty software"],
  authors: [{ name: "PropelAI" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "PropelAI Realty OS",
    description: "AI-powered CRM for modern real estate teams",
    siteName: "PropelAI Realty OS",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-[var(--font-inter)] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
