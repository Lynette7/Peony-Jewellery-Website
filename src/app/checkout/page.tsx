'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';
import MpesaPayment from '@/components/checkout/MpesaPayment';
import CardPayment from '@/components/checkout/CardPayment';
import { createOrder } from '@/lib/actions';

type PaymentMethod = 'mpesa' | 'card';
type CheckoutStep = 'info' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    // Create order in database
    const orderItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    await createOrder({
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      total: getCartTotal(),
      items: orderItems,
      payment_method: paymentMethod,
    });

    clearCart();
    setStep('confirmation');
  };

  // Redirect to cart if empty
  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Items to Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Your cart is empty. Add some items before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button size="lg">Go to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order, {formData.firstName}! We&apos;ve sent a confirmation email to {formData.email}. 
            You&apos;ll receive updates about your delivery soon.
          </p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/cart"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'info' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step === 'info' ? 'bg-primary text-background' : step === 'payment' ? 'bg-primary text-background' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="hidden sm:inline font-medium">Information</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step === 'payment' ? 'bg-primary text-background' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'info' && (
              <form onSubmit={handleSubmitInfo} className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="0712 345 678"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg">
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Payment Method</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                        paymentMethod === 'mpesa'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">Pay with mobile money</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        $
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">Card</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'mpesa' ? (
                  <MpesaPayment
                    amount={getCartTotal()}
                    onSuccess={handlePaymentSuccess}
                    onBack={() => setStep('info')}
                  />
                ) : (
                  <CardPayment
                    amount={getCartTotal()}
                    onSuccess={handlePaymentSuccess}
                    onBack={() => setStep('info')}
                  />
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">KES 300</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(getCartTotal() + 300)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
