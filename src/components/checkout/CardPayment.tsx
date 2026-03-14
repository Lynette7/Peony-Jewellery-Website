'use client';

import { useEffect, useRef } from 'react';
import { Smartphone, ArrowLeft, Lock } from 'lucide-react';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PaystackPop: any;
  }
}

interface CardPaymentProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onBack: () => void;
}

export default function CardPayment({ amount, email, name, phone, onSuccess, onBack }: CardPaymentProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || document.getElementById('paystack-script')) return;
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
  }, []);

  const handlePay = () => {
    if (!window.PaystackPop) {
      alert('Payment is still loading. Please try again in a moment.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email,
      amount: amount * 100, // Paystack uses kobo/cents
      currency: 'KES',
      channels: ['mobile_money'],
      ref: `peony_${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
          { display_name: 'Phone', variable_name: 'phone', value: phone },
        ],
      },
      callback: (response: { reference: string }) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        // User closed the payment popup — do nothing
      },
    });

    handler.openIframe();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">M-Pesa</h3>
          <p className="text-sm text-muted-foreground">Pay securely via M-Pesa</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span className="text-foreground">Total to Pay</span>
          <span className="text-primary">{formatPrice(amount)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
        <Lock size={14} />
        <span>Your M-Pesa payment is processed securely by Paystack</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center justify-center space-x-2"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>
        <Button type="button" fullWidth onClick={handlePay}>
          Pay {formatPrice(amount)} via M-Pesa
        </Button>
      </div>
    </div>
  );
}
