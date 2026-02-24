"use client";

import React, { useState } from "react";
import { Loader2, Smartphone, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/data/products";
import Button from "@/components/ui/Button";

interface MpesaPaymentProps {
  amount: number;
  onSuccess: () => void;
  onBack: () => void;
}

export default function MpesaPayment({
  amount,
  onSuccess,
  onBack,
}: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus("pending");

    const digits = phoneNumber.replace(/\D/g, "");
    let formatted: string;
    if (digits.startsWith("254")) {
      formatted = digits;             // already has country code
    } else if (digits.startsWith("0")) {
      formatted = "254" + digits.slice(1); // 0712... → 254712...
    } else {
      formatted = "254" + digits;     // 712... → 254712...
    }
    const pushRes = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: formatted, amount: amount }),
    });
    const push = await pushRes.json();

    if (!push.success) {
      setStatus("error");
      setIsProcessing(false);
      return;
    }

    // 2. Poll for status every 3 seconds (up to 30s)
    const checkoutRequestId = push.checkoutRequestId;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;
      if (attempts > 10) {
        clearInterval(poll);
        setStatus("error");
        setIsProcessing(false);
        return;
      }

      const statusRes = await fetch("/api/mpesa/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutRequestId }),
      });
      const statusData = await statusRes.json();

      if (statusData.ResultCode === "0" || statusData.ResultCode === 0) {
        clearInterval(poll);
        setStatus("success");
        setIsProcessing(false);
        setTimeout(() => onSuccess(), 2000);
      } else if (
        statusData.ResultCode !== undefined &&
        statusData.ResultCode !== "1032" &&
        statusData.ResultCode !== 1032 &&
        statusData.ResultCode !== "4999" &&
        statusData.ResultCode !== 4999
      ) {
        // Non-pending error
        clearInterval(poll);
        setStatus("error");
        setIsProcessing(false);
      }
      // ResultCode 1032 / 4999 = still processing, keep polling
    }, 13000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    // Format as Kenyan phone number
    if (digits.startsWith("254")) {
      return digits.slice(0, 12);
    } else if (digits.startsWith("0")) {
      return digits.slice(0, 10);
    } else if (digits.startsWith("7") || digits.startsWith("1")) {
      return digits.slice(0, 9);
    }
    return digits.slice(0, 10);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <Smartphone className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            M-Pesa Payment
          </h3>
          <p className="text-sm text-muted-foreground">
            You will receive an STK push on your phone
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Payment Successful!
          </h4>
          <p className="text-muted-foreground">
            Redirecting to confirmation...
          </p>
        </div>
      ) : status === "pending" ? (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Waiting for Payment
          </h4>
          <p className="text-muted-foreground mb-4">
            Please check your phone and enter your M-Pesa PIN to complete the
            payment.
          </p>
          <p className="text-sm text-muted-foreground">
            Amount:{" "}
            <span className="font-semibold text-foreground">
              {formatPrice(amount + 300)}
            </span>
          </p>
        </div>
      ) : status === "error" ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Payment Failed</h4>
          <p className="text-muted-foreground mb-6">
            The payment was cancelled or timed out. Please try again.
          </p>
          <Button onClick={() => { setStatus("idle"); setIsProcessing(false); }}>
            Try Again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="mpesaPhone"
              className="block text-sm font-medium text-foreground mb-2"
            >
              M-Pesa Phone Number *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                +254
              </span>
              <input
                type="tel"
                id="mpesaPhone"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(formatPhoneNumber(e.target.value))
                }
                placeholder="712 345 678"
                required
                className="w-full pl-16 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter the phone number registered with M-Pesa
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Order Amount</span>
              <span className="text-foreground">{formatPrice(amount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">KES 300</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">
                Total to Pay
              </span>
              <span className="font-bold text-primary">
                {formatPrice(amount + 300)}
              </span>
            </div>
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
            <Button
              type="submit"
              fullWidth
              disabled={isProcessing || phoneNumber.length < 9}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Processing...
                </>
              ) : (
                `Pay ${formatPrice(amount + 300)}`
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
