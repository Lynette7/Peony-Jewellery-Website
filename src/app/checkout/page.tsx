'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, MapPin, Plus, Star } from 'lucide-react';
import { UserAddress } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';
import MpesaPayment from '@/components/checkout/MpesaPayment';
import CardPayment from '@/components/checkout/CardPayment';
import { createOrder } from '@/lib/actions';
import CityDropdown from '@/components/ui/CityDropdown';
import { getShippingFee } from '@/data/shipping';

type PaymentMethod = 'mpesa' | 'card';
type CheckoutStep = 'info' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const supabase = createClient();
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
  const [orderError, setOrderError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Pre-fill contact info and addresses for logged-in users
  useEffect(() => {
    async function prefillUserData() {
      if (!user) return;
      const [{ data: profile }, { data: addresses }] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false }),
      ]);

      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: profile?.first_name || prev.firstName,
        lastName: profile?.last_name || prev.lastName,
        phone: profile?.phone || prev.phone,
      }));

      if (addresses && addresses.length > 0) {
        setSavedAddresses(addresses);
        const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData((prev) => ({
          ...prev,
          address: defaultAddr.address,
          city: defaultAddr.city,
          postalCode: defaultAddr.postal_code || '',
        }));
      }
    }
    prefillUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Synchronous — computed directly from the selected city
  const shippingFee = formData.city ? getShippingFee(formData.city) : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSuccess = async (mpesaCode?: string) => {
    setOrderError('');

    const orderItems = items.map((item) => ({
      id: item.product.id,
      name: item.selectedVariant
        ? `${item.product.name} (${item.selectedVariant.name})`
        : item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.selectedVariant?.image || item.product.image,
      variant: item.selectedVariant?.name || null,
    }));

    const result = await createOrder(
      {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        total: getCartTotal() + (shippingFee ?? 0),
        items: orderItems,
        payment_method: paymentMethod,
      },
      mpesaCode,
      shippingFee ?? 0,
    );

    if (result.success) {
      clearCart();
      setStep('confirmation');
    } else {
      setOrderError(result.error || 'Failed to create order. Please try again.');
      console.error('Order creation failed:', result.error);
    }
  };

  const orderTotal = getCartTotal() + (shippingFee ?? 0);

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
            Thank you for your order, {formData.firstName}! We&apos;ve sent a confirmation
            email to {formData.email}. You&apos;ll receive updates about your delivery soon.
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
                step === 'info' || step === 'payment' ? 'bg-primary text-background' : 'bg-muted'
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

                  {/* Saved address picker for logged-in users */}
                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setFormData((prev) => ({
                              ...prev,
                              address: addr.address,
                              city: addr.city,
                              postalCode: addr.postal_code || '',
                            }));
                          }}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <MapPin className="text-primary mt-0.5 flex-shrink-0" size={16} />
                              <div>
                                <p className="font-medium text-foreground text-sm">{addr.address}</p>
                                <p className="text-xs text-muted-foreground">
                                  {addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}
                                </p>
                              </div>
                            </div>
                            {addr.is_default && (
                              <span className="inline-flex items-center space-x-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                <Star size={10} fill="currentColor" />
                                <span>Default</span>
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddressId('new');
                          setFormData((prev) => ({ ...prev, address: '', city: '', postalCode: '' }));
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Plus size={16} />
                          <span className="text-sm font-medium">Use a different address</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Manual form — always shown for guests, shown when 'new' selected */}
                  {(!user || savedAddresses.length === 0 || selectedAddressId === 'new') && (
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
                          <label className="block text-sm font-medium text-foreground mb-2">
                            City / Town *
                          </label>
                          <CityDropdown
                            value={formData.city}
                            onChange={(city) =>
                              setFormData((prev) => ({ ...prev, city }))
                            }
                            required
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
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={!formData.city || !formData.address}
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                {orderError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                    {orderError}
                  </div>
                )}
                <MpesaPayment
                  amount={orderTotal}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep('info')}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const itemKey = item.selectedVariant
                    ? `${item.product.id}::${item.selectedVariant.name}`
                    : item.product.id;
                  const displayImage = item.selectedVariant?.image || item.product.image;

                  return (
                    <div key={itemKey} className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={displayImage}
                          alt={
                            item.selectedVariant
                              ? `${item.product.name} - ${item.selectedVariant.name}`
                              : item.product.name
                          }
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
                        {item.selectedVariant && (
                          <p className="text-xs text-primary font-medium">
                            {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shippingFee !== null
                      ? formatPrice(shippingFee)
                      : <span className="text-muted-foreground italic text-xs">Select a city</span>
                    }
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {shippingFee !== null
                        ? formatPrice(orderTotal)
                        : formatPrice(getCartTotal())}
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
