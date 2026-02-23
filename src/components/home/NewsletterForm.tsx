'use client';

import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions';
import { Sparkles } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setErrorMessage('');

    const result = await subscribeToNewsletter({ email });
    setIsSubmitting(false);

    if (result.success) {
      setSubmittedEmail(email);
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-5 animate-[fadeIn_0.4s_ease-out]">
        {/* Icon badge */}
        <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>

        {/* Headline */}
        <div className="space-y-2 text-center">
          <p className="text-2xl font-bold text-background">You&apos;re in! 🌸</p>
          <p className="text-background/80 text-sm max-w-xs mx-auto">
            Welcome to the Peony inner circle,{' '}
            <span className="font-semibold text-accent">{submittedEmail}</span>.
            Check your inbox for a little something from us.
          </p>
        </div>

        {/* Perks row */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {['New arrivals first', 'Exclusive deals', 'Styling tips', 'Giveaways'].map((perk) => (
            <span
              key={perk}
              className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-medium"
            >
              {perk}
            </span>
          ))}
        </div>

        {/* Re-subscribe nudge */}
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-background/50 hover:text-background/80 transition-colors mt-1 underline underline-offset-2"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-4 text-center text-red-300 text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
