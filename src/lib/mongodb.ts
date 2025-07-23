import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const uri: string = process.env.MONGODB_URI;
let cachedClient: MongoClient;
let cachedDb: Db;

/**
 * Returns a singleton instance of connected MongoDB database
 */
export async function getDb(): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
    }

    await cachedClient.connect();
    cachedDb = cachedClient.db();
    return cachedDb;
}
