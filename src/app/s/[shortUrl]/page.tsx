import { getDb } from "@/lib/mongodb";
import { sanitizeShortId } from "@/lib/validation";
import { LinkTimer } from "@/components/LinkTimer";
import { config, googleAdsConfig } from "@/lib/config";
import { GoogleAd } from "@/components/GoogleAd";
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
      {googleAdsConfig.enabled && googleAdsConfig.clientId && (
        <Script 
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsConfig.clientId}`}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      )}
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Banner Ad - Above notification */}
        {googleAdsConfig.enabled && googleAdsConfig.adSlots.redirectPage.banner && (
          <div className="w-full bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-2">
              <GoogleAd 
                slot={googleAdsConfig.adSlots.redirectPage.banner} 
                format="horizontal"
                className="max-h-20"
                style={{ maxHeight: "90px" }}
              />
            </div>
          </div>
        )}

        {/* Top Section - Compact Navbar Style */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center h-12 shadow px-2 sm:px-0">
          <span className="font-semibold text-base text-center w-full sm:w-auto">
            Your link is being generated. Please wait — it will appear at the bottom of the screen. 👇
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
              
              {/* Primary Ad Space - Left/Top */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[350px] flex items-center justify-center">
                  {googleAdsConfig.enabled && googleAdsConfig.adSlots.redirectPage.primary ? (
                    <GoogleAd 
                      slot={googleAdsConfig.adSlots.redirectPage.primary}
                      className="w-full h-full min-h-[300px]"
                      style={{ minHeight: "300px" }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">Primary Advertisement Space</p>
                      <p className="text-sm">Configure your Google Ads slot in the config</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Ad Space - Right/Bottom */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-white p-4 rounded-lg shadow-sm border min-h-[350px] flex items-center justify-center">
                  {googleAdsConfig.enabled && googleAdsConfig.adSlots.redirectPage.secondary ? (
                    <GoogleAd 
                      slot={googleAdsConfig.adSlots.redirectPage.secondary}
                      className="w-full h-full min-h-[300px]"
                      style={{ minHeight: "300px" }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-base mb-2">Secondary Ad Space</p>
                      <p className="text-xs">Side advertisement</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
