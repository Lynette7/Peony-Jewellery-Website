import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { getProductsByCategory } from '@/lib/products';
import { categories } from '@/data/products';
import { Category } from '@/types';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Generate static params for all categories
export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

// Generate metadata for each category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = categories.find((c) => c.id === category);

  if (!categoryInfo) {
    return {
      title: 'Category Not Found | Peony HQ Kenya',
    };
  }

  return {
    title: `${categoryInfo.name} | Peony HQ Kenya`,
    description: categoryInfo.description,
  };
}

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // Validate category
  const categoryInfo = categories.find((c) => c.id === category);
  if (!categoryInfo) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(category as Category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 capitalize">
            {categoryInfo.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter activeCategory={category as Category} />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{categoryProducts.length}</span> products in {categoryInfo.name}
          </p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No products found in this category yet.
            </p>
            <p className="text-muted-foreground">
              Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
