import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mt-4">Last updated: March 10, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm sm:prose max-w-none space-y-10 text-muted-foreground">
          {/* Introduction */}
          <div>
            <p className="leading-relaxed">
              Welcome to Peony HQ Kenya. These Terms of Service (&quot;Terms&quot;) govern your
              access to and use of our website at{' '}
              <a href="https://peonyhq.co.ke" className="text-primary hover:underline">
                peonyhq.co.ke
              </a>{' '}
              and the purchase of products from our online store. By using our website or placing an
              order, you agree to be bound by these Terms. If you do not agree, please do not use
              our services.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. General</h2>
            <p className="leading-relaxed">
              Peony HQ Kenya is an online jewellery store based in Nairobi, Kenya. We reserve the
              right to update or modify these Terms at any time without prior notice. Your continued
              use of the website after any changes constitutes acceptance of the updated Terms.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
            <p className="leading-relaxed">
              You must be at least 18 years old to use our website and make purchases. By using our
              services, you represent and warrant that you meet this age requirement.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Registration</h2>
            <p className="leading-relaxed mb-3">
              To place orders and access certain features, you may need to create an account. You
              agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete information during registration</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
              <li>Accept responsibility for all activity occurring under your account</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Products & Pricing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All product descriptions and images are provided for informational purposes. While
                we strive for accuracy, slight variations in colour or appearance may occur due to
                photography and screen differences.
              </li>
              <li>
                Prices are listed in Kenyan Shillings (KES) and are subject to change without
                notice.
              </li>
              <li>
                We reserve the right to correct any pricing errors, even after an order has been
                placed.
              </li>
              <li>
                Product availability is not guaranteed. We may limit quantities or discontinue
                products at any time.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Orders & Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Placing an order constitutes an offer to purchase. We reserve the right to accept or
                decline any order.
              </li>
              <li>
                Payment must be made at the time of purchase. We accept M-Pesa and card payments
                through our secure payment partners.
              </li>
              <li>
                An order confirmation email will be sent upon successful placement. This does not
                guarantee fulfilment until the order has been processed and dispatched.
              </li>
              <li>
                If we are unable to fulfil your order, we will notify you and provide a full refund.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We deliver within Nairobi and across Kenya. Delivery timelines are estimated and
                may vary depending on your location.
              </li>
              <li>
                Shipping costs are calculated at checkout based on your delivery address.
              </li>
              <li>
                Risk of loss or damage passes to you upon delivery. Please inspect your package
                upon receipt.
              </li>
              <li>
                We are not responsible for delays caused by third-party courier services, customs,
                or events beyond our control.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Returns & Exchanges</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If you receive a damaged or incorrect item, please contact us within 48 hours of
                delivery with photos of the issue.
              </li>
              <li>
                Eligible returns must be in their original, unused condition with all packaging
                intact.
              </li>
              <li>
                Return shipping costs may apply unless the return is due to our error.
              </li>
              <li>
                Refunds will be processed to the original payment method within 7-14 business days
                after we receive and inspect the returned item.
              </li>
              <li>
                Custom or personalised items are not eligible for returns unless they arrive damaged
                or defective.
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on this website — including text, images, logos, graphics, and product
              designs — is the property of Peony HQ Kenya or its licensors and is protected by
              intellectual property laws. You may not reproduce, distribute, or use any content
              from this website without our prior written consent.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. User Conduct</h2>
            <p className="leading-relaxed mb-3">When using our website, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Post defamatory, abusive, or harmful content in reviews or messages</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the fullest extent permitted by law, Peony HQ Kenya shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the
              website or purchase of products. Our total liability for any claim related to our
              products or services shall not exceed the amount you paid for the specific product
              in question.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              Our website and products are provided &quot;as is&quot; and &quot;as available&quot;
              without warranties of any kind, whether express or implied. We do not warrant that
              the website will be uninterrupted, error-free, or free of harmful components.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Kenya.
              Any disputes arising from these Terms or your use of our services shall be subject to
              the exclusive jurisdiction of the courts of Kenya.
            </p>
          </div>

          {/* Section 13 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
            <p className="leading-relaxed mb-3">
              If you have any questions about these Terms, please contact us:
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
