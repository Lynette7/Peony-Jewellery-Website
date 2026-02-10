'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Check, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Product } from '@/types';
import { Review } from '@/types/database';
import { formatPrice, getProductsByCategory } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import { createReview, getProductReviews } from '@/lib/actions';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    review: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Combine main image with additional images for carousel
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Fetch reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      const result = await getProductReviews(product.id);
      if (result.success && result.data) {
        setReviews(result.data);
      }
      setIsLoadingReviews(false);
    };
    fetchReviews();
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + allImages.length) % allImages.length);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError('');

    const result = await createReview({
      product_id: product.id,
      customer_name: reviewForm.name,
      customer_email: reviewForm.email,
      rating: reviewForm.rating,
      title: reviewForm.title || null,
      review_text: reviewForm.review,
    });

    setIsSubmittingReview(false);

    if (result.success) {
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setReviewForm({ name: '', email: '', rating: 5, title: '', review: '' });
      // Refresh reviews
      const reviewsResult = await getProductReviews(product.id);
      if (reviewsResult.success && reviewsResult.data) {
        setReviews(reviewsResult.data);
      }
    } else {
      setReviewError(result.error || 'Failed to submit review');
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setReviewForm((f) => ({ ...f, rating: star })) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section with Carousel */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="bg-foreground text-background px-6 py-3 rounded-full font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.featured && product.inStock && (
                <span className="absolute top-4 left-4 bg-primary text-background px-4 py-2 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
              
              {/* Carousel Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} className="text-foreground" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background rounded-full flex items-center justify-center transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} className="text-foreground" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm text-foreground">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-muted-foreground">
                    ({averageRating.toFixed(1)}) · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {(product.specifications && Object.values(product.specifications).some(v => v)) && (
              <div className="space-y-2 border-t border-b border-border py-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Specifications</h3>
                {product.specifications.material && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="text-foreground font-medium">{product.specifications.material}</span>
                  </div>
                )}
                {product.specifications.color && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="text-foreground font-medium">{product.specifications.color}</span>
                  </div>
                )}
                {product.specifications.design && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Design:</span>
                    <span className="text-foreground font-medium">{product.specifications.design}</span>
                  </div>
                )}
                {product.specifications.properties && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Properties:</span>
                    <span className="text-foreground font-medium">{product.specifications.properties}</span>
                  </div>
                )}
                {product.specifications.style && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="text-foreground font-medium">{product.specifications.style}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability:</span>
                  <span className={product.inStock ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Availability (shown when no specs) */}
            {(!product.specifications || !Object.values(product.specifications).some(v => v)) && (
              <div className="border-t border-b border-border py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability:</span>
                  <span className={product.inStock ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 border border-border rounded-xl p-2 pr-4 hover:border-primary transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={variant.image}
                          alt={variant.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <span className="text-sm text-foreground font-medium">{variant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-foreground font-medium">Quantity:</span>
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={decrementQuantity}
                      className="p-3 hover:bg-muted rounded-l-full transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 font-medium text-foreground">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="p-3 hover:bg-muted rounded-r-full transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    fullWidth
                    className="flex items-center justify-center space-x-2"
                  >
                    {addedToCart ? (
                      <>
                        <Check size={20} />
                        <span>Added to Cart!</span>
                      </>
                    ) : isInCart(product.id) ? (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add More to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(product)}
                    variant={isInWishlist(product.id) ? 'primary' : 'outline'}
                    size="lg"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <Truck size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <Shield size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <RotateCcw size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
              {reviews.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  {renderStars(Math.round(averageRating), 20)}
                  <span className="text-foreground font-medium">{averageRating.toFixed(1)} out of 5</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
            >
              Write a Review
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-muted/30 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Write Your Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                    {reviewError}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="review-email" className="block text-sm font-medium text-foreground mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="review-email"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Rating *
                  </label>
                  {renderStars(reviewForm.rating, 28, true)}
                </div>

                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium text-foreground mb-2">
                    Review Title (optional)
                  </label>
                  <input
                    type="text"
                    id="review-title"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="review-text" className="block text-sm font-medium text-foreground mb-2">
                    Your Review *
                  </label>
                  <textarea
                    id="review-text"
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm((f) => ({ ...f, review: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="flex items-center space-x-2"
                  >
                    <Send size={18} />
                    <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Review Submitted Message */}
          {reviewSubmitted && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-8">
              <p className="text-green-700 dark:text-green-300">
                Thank you for your review! It has been submitted successfully.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Star className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to review this product!
              </p>
              <Button onClick={() => setShowReviewForm(true)} variant="outline">
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {renderStars(review.rating)}
                        {review.verified_purchase && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="font-semibold text-foreground">{review.title}</h4>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2">{review.review_text}</p>
                  <p className="text-sm text-foreground font-medium">— {review.customer_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
