import { getDb } from "@/lib/mongodb";
import { sanitizeShortId } from "@/lib/validation";
import { LinkTimer } from "@/components/LinkTimer";
import { config, googleAdsConfig } from "@/lib/config";
import { redirect } from "next/navigation";
import Script from "next/script";

interface RedirectPageProps {
  params: Promise<{ shortUrl: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortUrl } = await params;
  
  // Sanitize the shortUrl to prevent injection attacks
  const sanitizedShortUrl = sanitizeShortId(shortUrl);
  
  // If the sanitized URL is empty or different from the original, return 404
  if (!sanitizedShortUrl || sanitizedShortUrl !== shortUrl) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold">Invalid URL</h1>
        <p>The provided short URL is invalid.</p>
      </div>
    );
  }

  const db = await getDb();

  // Look up the URL by shortId
  // console.log('Looking up URL with shortId:', sanitizedShortUrl);
  
  // Increment accesses count and fetch updated document
  const result = await db.collection("urls").findOneAndUpdate(
    { shortId: sanitizedShortUrl },
    { $inc: { accesses: 1 } },
    { returnDocument: "after" }
  );
  if (!result) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p>No URL found for <code>{shortUrl}</code></p>
      </div>
    );
  }

  const { originalUrl, clicks, accesses } = result;

  // If redirect page is disabled, redirect directly to the target URL
  if (!config.features.redirectPage.enabled || accesses <= config.features.redirectPage.showOnlyAfterXAccesses) {
    await db.collection("urls").updateOne({ shortId: sanitizedShortUrl }, { $inc: { clicks: 1 } });
    redirect(originalUrl);
  }

  return (
    <>
      {/* Google Ads Script - Load once globally */}
      {googleAdsConfig.enabledScript && googleAdsConfig.clientId && (
        <Script 
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsConfig.clientId}`}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
          async
        />
      )}
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Section - Compact Navbar Style */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center h-12 shadow px-2 sm:px-0">
          <span className="font-semibold text-base text-center w-full sm:w-auto">
            Your link is being generated. Please wait — it will appear at the bottom of the screen. 👇
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow py-8">
          <div className="container mx-auto px-4">
        
            {/* Additional Content or Information */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-center text-gray-600 text-sm">
                <p className="mb-2">🔒 Your link is being securely processed</p>
                <p>This page helps support our free service through advertisements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section with Timer and Link */}
        <LinkTimer originalUrl={originalUrl} clicks={clicks} shortId={sanitizedShortUrl} />
      </div>
    </>
  );
}
