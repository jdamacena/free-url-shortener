import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface RedirectPageProps {
  params: Promise<{ shortUrl: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortUrl } = await params;
  const db = await getDb();

  // Validate that the shortUrl param is a valid ObjectId
  if (!ObjectId.isValid(shortUrl)) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p>Invalid link identifier.</p>
      </div>
    );
  }

  // Increment click count and retrieve the original URL by MongoDB _id
  const objectId = new ObjectId(shortUrl);
  const result = await db.collection("urls").findOneAndUpdate(
    { _id: objectId },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" }
  );

  if (!result || !result.value) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold">Not found</h1>
        <p>No URL found for <code>{shortUrl}</code></p>
      </div>
    );
  }

  const { originalUrl, clicks } = result.value;

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
