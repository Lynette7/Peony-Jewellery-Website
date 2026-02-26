"use client";

import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { formatPrice } from "@/data/products";
import Button from "@/components/ui/Button";

const TILL_NUMBER = "3238987";

interface MpesaPaymentProps {
  amount: number;
  onSuccess: (mpesaCode: string) => void;
  onBack: () => void;
}

export default function MpesaPayment({
  amount,
  onSuccess,
  onBack,
}: MpesaPaymentProps) {
  const total = amount;
  const [mpesaCode, setMpesaCode] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => onSuccess(mpesaCode.trim().toUpperCase()), 2000);
  };

  if (confirmed) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Payment Confirmed!
          </h4>
          <p className="text-muted-foreground">
            Redirecting to confirmation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            M-Pesa Payment
          </h3>
          <p className="text-sm text-muted-foreground">
            Pay directly to till number
          </p>
        </div>
      </div>

      {/* Amount summary */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Total to Pay</span>
          <span className="font-bold text-primary text-lg">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Till */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Till Number</p>
          <p className="text-3xl font-bold text-foreground tracking-widest">
            {TILL_NUMBER}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Lynette Wanjiru Mwangi
          </p>
        </div>
      </div>

      {/* Instructions */}
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside bg-muted/30 rounded-xl p-4">
        <li>Open M-Pesa on your phone</li>
        <li>Select <span className="font-medium text-foreground">Lipa na M-Pesa</span> → <span className="font-medium text-foreground">Buy Goods and Services</span></li>
        <li>Enter till number <span className="font-medium text-foreground">{TILL_NUMBER}</span></li>
        <li>Enter amount <span className="font-medium text-foreground">{formatPrice(total)}</span></li>
        <li>Enter your M-Pesa PIN and confirm</li>
      </ol>

      {/* M-Pesa confirmation code */}
      <div className="space-y-2">
        <label htmlFor="mpesaCode" className="block text-sm font-medium text-foreground">
          M-Pesa Confirmation Code *
        </label>
        <input
          id="mpesaCode"
          type="text"
          value={mpesaCode}
          onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
          placeholder="e.g. RCA7X8Y9Z0"
          maxLength={12}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          Found in the M-Pesa SMS you received after paying.
        </p>
      </div>

      {/* Actions */}
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
        <Button
          type="button"
          fullWidth
          onClick={handleConfirm}
          disabled={mpesaCode.trim().length < 8}
        >
          I Have Paid
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Only click &quot;I Have Paid&quot; after completing the M-Pesa transaction.
        Your order will be confirmed once payment is verified.
      </p>
    </div>
  );
}
