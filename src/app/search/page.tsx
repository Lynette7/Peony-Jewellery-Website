import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { searchProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Search | Peony HQ Kenya',
  description: 'Search our jewellery collection.',
};

export const revalidate = 0; // Always fresh results

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {query ? (
              <>
                Results for &ldquo;<span className="text-primary">{query}</span>&rdquo;
              </>
            ) : (
              'Search'
            )}
          </h1>
          {query && (
            <p className="text-muted-foreground mt-2">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!query ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Enter a search term to find jewellery.
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchX size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different search term.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary text-background rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
