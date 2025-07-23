import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sanitizeShortId } from "@/lib/validation";
import { headers } from "next/headers";

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

  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      <h1 className="text-3xl font-bold">Redirecting...</h1>
      <p className="text-gray-600">
        Destination: <a href={originalUrl} className="text-blue-500 underline">{originalUrl}</a>
      </p>
      <a href={originalUrl}>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Go Now
        </button>
      </a>
      <p className="text-sm text-gray-500">This link has been clicked {clicks} times.</p>
    </div>
  );
}
