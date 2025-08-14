import { MongoClient, Db } from "mongodb";
import { config as appConfig } from "@/lib/config";

// Use central config as the single source of truth for DB URI
const uri: string = appConfig.infrastructure.database.uri;
if (!uri) {
    throw new Error("Missing MongoDB URI in configuration (config.infrastructure.database.uri)");
}
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
