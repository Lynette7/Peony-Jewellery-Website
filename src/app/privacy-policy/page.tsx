import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mt-4">Last updated: March 10, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm sm:prose max-w-none space-y-10 text-muted-foreground">
          {/* Introduction */}
          <div>
            <p className="leading-relaxed">
              Peony HQ Kenya (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website at{' '}
              <a href="https://peonyhq.co.ke" className="text-primary hover:underline">
                peonyhq.co.ke
              </a>{' '}
              and use our services. Please read this policy carefully.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Personal Information You Provide
            </h3>
            <p className="leading-relaxed mb-3">
              When you create an account, place an order, or contact us, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>Payment information (processed securely through our payment partners)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
              Information Collected Automatically
            </h3>
            <p className="leading-relaxed mb-3">
              When you browse our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website or source</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and fulfil your orders</li>
              <li>Create and manage your account</li>
              <li>Communicate with you about orders, products, and promotions</li>
              <li>Send newsletters (only if you have opted in)</li>
              <li>Improve our website and customer experience</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Share Your Information</h2>
            <p className="leading-relaxed mb-3">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Payment processors:</strong> To securely process
                your payments (e.g., M-Pesa, card payment providers).
              </li>
              <li>
                <strong className="text-foreground">Delivery partners:</strong> To deliver your
                orders to your specified address.
              </li>
              <li>
                <strong className="text-foreground">Service providers:</strong> Third-party services
                that help us operate our website (e.g., hosting, analytics).
              </li>
              <li>
                <strong className="text-foreground">Legal requirements:</strong> When required by law
                or to protect our rights.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Cookies</h2>
            <p className="leading-relaxed">
              We use cookies and similar technologies to enhance your experience on our website.
              Cookies help us remember your preferences, keep you logged in, and understand how you
              interact with our site. You can manage cookie preferences through your browser settings.
              Disabling cookies may affect some features of the website.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. Payment
              information is processed through secure, PCI-compliant payment processors and is never
              stored on our servers.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information for as long as necessary to provide our services,
              fulfil orders, and comply with legal obligations. If you close your account, we will
              delete your personal data within a reasonable timeframe, except where retention is
              required by law.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Withdraw consent for data processing where applicable</li>
            </ul>
            <p className="leading-relaxed mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:peonyhqkenya@gmail.com" className="text-primary hover:underline">
                peonyhqkenya@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party websites (e.g., social media platforms).
              We are not responsible for the privacy practices of these external sites. We encourage
              you to review their privacy policies before providing any personal information.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly
              collect personal information from children. If you believe a child has provided us with
              personal information, please contact us so we can take appropriate action.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated &quot;Last updated&quot; date. We encourage you to review this
              policy periodically.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
            <p className="leading-relaxed mb-3">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:peonyhqkenya@gmail.com" className="text-primary hover:underline">
                  peonyhqkenya@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-foreground">Phone:</strong>{' '}
                <a href="tel:+254111887020" className="text-primary hover:underline">
                  +254 111 887 020
                </a>
              </li>
              <li>
                <strong className="text-foreground">Location:</strong> Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
