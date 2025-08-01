"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { defaultMetadata } from "./metadata";
import "@/index.css";
import { config } from "@/lib/config";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackFrontendEvent } from "@/lib/analytics/client";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = defaultMetadata;

/**
 * Tracks page views with extended analytics fields.
 * Configurable via src/lib/config.ts for privacy and business needs.
 */
function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    // Collect referrer
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;
    // Collect user agent
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
    // Collect query params
    let query: Record<string, string> | undefined = undefined;
    if (typeof window !== "undefined") {
      query = Object.fromEntries(new URLSearchParams(window.location.search));
    }
    trackFrontendEvent({
      type: "page_view",
      pathname,
      referrer,
      userAgent,
      query,
      timestamp: Date.now(),
    });
  }, [pathname]);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReactQueryProvider>
            <TooltipProvider>
              <AnalyticsTracker />
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ReactQueryProvider>
        </ThemeProvider>
        {/* Cloudflare Web Analytics */}
        {process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN })}
          />
        )}
        {/* End Cloudflare Web Analytics */}
      </body>
    </html>
  );
}
