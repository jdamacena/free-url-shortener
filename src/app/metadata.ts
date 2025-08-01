import { Metadata } from "next";
import { config } from "@/lib/config";

/**
 * Generates dynamic metadata for pages based on brand configuration
 */
export function generatePageMetadata(
    title?: string,
    description?: string,
    path?: string
): Metadata {
    const pageTitle = title || `${config.brand.name} - ${config.brand.title}`;
    const pageDescription = description || config.brand.description;
    const url = path ? `${config.brand.url}${path}` : config.brand.url;

    return {
        title: pageTitle,
        description: pageDescription,
        keywords: [...config.seo.keywords],
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            url: url,
            siteName: config.brand.name,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: pageTitle,
            description: pageDescription,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: url,
        },
    };
}

/**
 * Default metadata for the application
 */
export const defaultMetadata: Metadata = generatePageMetadata();
