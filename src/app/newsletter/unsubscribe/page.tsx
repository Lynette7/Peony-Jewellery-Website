'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const success = status === 'success';

  return (
    <div className="max-w-md w-full text-center space-y-6">
      <div className="flex justify-center">
        {success ? (
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-foreground">
        {success ? 'You\u2019ve been unsubscribed' : 'Something went wrong'}
      </h1>

      <p className="text-muted-foreground">
        {success
          ? 'You will no longer receive newsletter emails from Peony HQ Kenya. We\u2019re sad to see you go! 🌸'
          : 'We couldn\u2019t process your unsubscribe request. The link may be invalid or expired. Please try again or contact us for help.'}
      </p>

      {success && (
        <p className="text-sm text-muted-foreground">
          Changed your mind? You can always re-subscribe on our{' '}
          <Link href="/" className="text-primary hover:underline font-medium">
            homepage
          </Link>
          .
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
        {!success && (
          <Link
            href="/contact"
            className="px-6 py-3 border border-border text-foreground rounded-full font-medium hover:bg-muted transition-colors"
          >
            Contact Us
          </Link>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
