'use client';

import React, { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/actions';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    const result = await subscribeToNewsletter({ email });

    setIsSubmitting(false);
    
    if (result.success) {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed to subscribe. Please try again.');
    }
  };

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
      
      {status !== 'idle' && (
        <p className={`mt-4 text-center ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
