import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { getProductById, getProducts } from '@/lib/products';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

// Generate metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found | Peony HQ Kenya',
    };
  }

  return {
    title: `${product.name} | Peony HQ Kenya`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

// Revalidate every 60 seconds to get fresh data
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
