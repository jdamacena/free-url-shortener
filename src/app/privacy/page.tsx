import { config } from "@/lib/config";
import { generatePageMetadata } from "../metadata";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(
  `Privacy Policy | ${config.brand.name}`,
  `Privacy Policy for ${config.brand.name} - Learn how we protect your data and respect your privacy.`,
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-4xl mx-auto [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:mb-4 [&_li]:ml-4 [&_li]:pl-2 [&_li]:my-2 marker:text-gray-500 [&_h2]:mt-8 [&_h2]:mb-4">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <section className="mb-8">
            <p className="lead">
              At {config.brand.name}, we take your privacy seriously. This privacy policy describes how we collect,
              use, and protect your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2>1. Information We Collect</h2>
            <p>We collect and process the following types of information:</p>
            <h3 className="text-lg font-semibold mt-4">1.1. Service Data:</h3>
            <ul>
              <li>URLs submitted for shortening</li>
              <li>Generated short URLs</li>
              <li>Creation timestamps</li>
              <li>Click statistics and access logs</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4">1.2. Technical Data:</h3>
            <ul>
              <li>IP addresses (for rate limiting and abuse prevention)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Reference URLs</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">1.3. Usage Data:</h3>
            <ul>
              <li>Service interaction patterns</li>
              <li>Feature usage statistics</li>
              <li>Error logs</li>
              <li>Performance metrics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our URL shortening service</li>
              <li>Prevent abuse, fraud, and spam</li>
              <li>Generate anonymous usage statistics</li>
              <li>Improve our service and user experience</li>
              <li>Debug and optimize service performance</li>
              <li>Ensure compliance with our terms of service</li>
              <li>Respond to legal requests when required</li>
              <li>Protect our rights, privacy, safety, or property</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>3. Data Retention</h2>
            <h3 className="text-lg font-semibold mt-4">3.1. Service Data:</h3>
            <p>
              URL data is retained for as long as the shortened URLs remain active in our system
              or until explicitly deleted. Inactive URLs may be automatically removed after 365 days
              of no usage.
            </p>

            <h3 className="text-lg font-semibold mt-4">3.2. Technical Data:</h3>
            <p>
              IP addresses used for rate limiting are stored for up to 24 hours.
              Access logs are retained for 30 days for security and debugging purposes.
            </p>

            <h3 className="text-lg font-semibold mt-4">3.3. Usage Data:</h3>
            <p>
              Anonymous usage statistics are retained for up to 12 months.
              Personal data in error logs is automatically removed after 7 days.
            </p>
          </section>

          <section className="mb-8">
            <h2>4. Cookies and Similar Technologies</h2>
            <h3 className="text-lg font-semibold mt-4">4.1. Essential Cookies:</h3>
            <p>
              We use essential cookies to maintain basic service functionality and security.
              These cookies are strictly necessary and cannot be disabled.
            </p>

            <h3 className="text-lg font-semibold mt-4">4.2. Analytics Cookies:</h3>
            <p>
              We use analytics cookies to understand service usage patterns.
              This data is anonymized and does not personally identify users.
              You can opt out of analytics cookies without affecting core functionality.
            </p>

            <h3 className="text-lg font-semibold mt-4">4.3. Local Storage:</h3>
            <p>
              We use local storage to improve performance and save your preferences.
              This data remains on your device and is not transmitted to our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information from unauthorized
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2>6. Third-Party Services</h2>
            <p>
              We use third-party services for:
            </p>
            <ul>
              <li>Infrastructure and hosting (e.g., cloud services)</li>
              <li>Analytics and performance monitoring</li>
              <li>Security and fraud prevention</li>
              <li>Error tracking and debugging</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies and may collect data as described in their
              respective policies. We carefully select our providers and require them to maintain
              appropriate security measures.
            </p>
          </section>

          <section className="mb-8">
            <h2>7. Your Privacy Rights</h2>
            <p>
              This service does not store personal data or associate shortened URLs with individual users. As a result, there is no personal data available for access, download, or portability. If you have questions about privacy or data handling, please contact us using the information provided in the Contact section.
            </p>
          </section>

          <section className="mb-8">
            <h2>8. International Data Transfers</h2>
            <p>
              We may transfer your data to servers and service providers located outside your country.
              When we do, we ensure appropriate safeguards are in place through:
            </p>
            <ul>
              <li>Standard contractual clauses</li>
              <li>Data processing agreements</li>
              <li>Adequacy decisions where applicable</li>
              <li>Other legal mechanisms as required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2>9. Contact Us</h2>
            {config.contact.email && (
              <p>
                If you have any questions about this privacy policy, please contact us at{" "}
                <a href={`mailto:${config.contact.email}`} className="text-primary hover:underline">
                  {config.contact.email}
                </a>
              </p>
            )}
          </section>

          <div className="text-sm text-muted-foreground mt-12">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </main>
    </div>
  );
}
