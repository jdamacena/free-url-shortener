import { getDb } from "@/lib/mongodb";
import { sanitizeShortId } from "@/lib/validation";
import { LinkTimer } from "@/components/LinkTimer";
import { config } from "@/lib/config";
import { redirect } from "next/navigation";

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
  console.log('Looking up URL with shortId:', sanitizedShortUrl);
  
  // First, let's check if the document exists with the sanitized shortId
  const doc = await db.collection("urls").findOne({ shortId: sanitizedShortUrl });
  console.log('Found document:', doc);

  const result = await db.collection("urls").findOneAndUpdate(
    { shortId: shortUrl },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" }
  );
  console.log('Update result:', result);

  if (!result) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p>No URL found for <code>{shortUrl}</code></p>
      </div>
    );
  }

  const { originalUrl, clicks } = result;

  // If redirect page is disabled, redirect directly to the target URL
  if (!config.features.redirectPage.enabled) {
    redirect(originalUrl);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h1 className="text-3xl font-bold mb-2">Your Link is Being Generated</h1>
        <p className="text-lg">Please wait while we prepare your link. It will be available at the bottom of this page.</p>
      </div>

      {/* Ad Space */}
      <div className="flex-grow py-8">
        <div className="container mx-auto">
          <div className="bg-gray-100 p-4 rounded-lg text-center min-h-[300px]">
            <p className="text-gray-600">Advertisement Space</p>
            {/* Add your ad component or code here */}
          </div>
        </div>
      </div>

      {/* Bottom Section with Timer and Link */}
      <LinkTimer originalUrl={originalUrl} clicks={clicks} />
    </div>
  );
}
