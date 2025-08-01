import { config } from "@/lib/config";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-4xl mx-auto [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:mb-4 [&_li]:ml-4 [&_li]:pl-2 [&_li]:my-2 marker:text-gray-500 [&_h2]:mt-8 [&_h2]:mb-4">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <section className="mb-8">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using {config.brand.name}, you accept and agree to be bound by the terms
              and conditions of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2>2. Description of Service</h2>
            <p>
              {config.brand.name} provides a URL shortening service that allows users to create shortened
              versions of long URLs. The service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties.
            </p>
          </section>

          <section className="mb-8">
            <h2>3. User Responsibilities</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Share malicious content, malware, viruses, or any other harmful code</li>
              <li>Engage in phishing, fraudulent activities, or deceptive practices</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Distribute spam, unwanted content, or excessive automated requests</li>
              <li>Infringe on intellectual property rights or proprietary rights</li>
              <li>Share content that is illegal, obscene, defamatory, or promotes hatred</li>
              <li>Attempt to bypass our rate limits or security measures</li>
              <li>Resell or redistribute our services without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>4. Service Limitations</h2>
            <p>
              We reserve the right to:
            </p>
            <ul>
              <li>Modify, suspend, or terminate the service for any reason without prior notice</li>
              <li>Delete any URLs that violate our terms or are reported as abusive</li>
              <li>Change these terms at any time (with notification of material changes)</li>
              <li>Implement and modify rate limits or access restrictions as needed</li>
              <li>Monitor usage and investigate suspicious activities</li>
              <li>Display advertising on our service pages</li>
              <li>Share anonymous usage statistics with third parties</li>
              <li>Implement security measures we deem necessary</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2>5. Third-Party Services</h2>
            <p>
              Our service may include third-party services, advertisements, and links to other websites.
              We are not responsible for the content, privacy policies, or practices of these third-party
              services. Your interactions with these services are governed by their respective terms and
              policies.
            </p>
          </section>

          <section className="mb-8">
            <h2>5. Privacy</h2>
            <p>
              Your use of {config.brand.name} is also governed by our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2>6. Disclaimer of Warranties</h2>
            <p>
              {config.brand.name} is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no
              warranties, expressed or implied, and hereby disclaim all warranties, including without
              limitation, implied warranties of merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
          </section>

          <section className="mb-8">
            <h2>7. Contact</h2>
            {config.contact.email && (
              <p>
                For any questions regarding these terms, please contact us at{" "}
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
