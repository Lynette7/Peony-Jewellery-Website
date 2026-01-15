'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductUpdate } from '@/types/database';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProductUpdate>({
    name: '',
    description: '',
    price: 0,
    category: 'earrings',
    image: '',
    in_stock: true,
  });
  const supabase = createClient();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product not found');

      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        in_stock: data.in_stock,
      });
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/products');
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8dae2]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-[#f8dae2] hover:text-[#fcfbf9] mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Edit Product</h1>
        <p className="text-[#f8dae2]">Update the product details below.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
              placeholder="e.g., Pearl Drop Earrings"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent resize-none text-[#fcfbf9] placeholder-[#f8dae2]/50"
              placeholder="Describe the product..."
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#f8dae2] mb-1">
                Price (KES) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#f8dae2] mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
              >
                <option value="earrings">Earrings</option>
                <option value="necklaces">Necklaces</option>
                <option value="rings">Rings</option>
                <option value="bracelets">Bracelets</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Image URL *
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                className="flex-1 px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#4d0025] flex-shrink-0 border border-[#920b4c]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-[#f8dae2]/70 mt-1">
              Use a direct link to an image. Tip: Use Unsplash for free stock photos.
            </p>
          </div>

          {/* In Stock */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in_stock"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-[#920b4c] bg-[#4d0025] border-[#920b4c] rounded focus:ring-[#f8dae2]"
            />
            <label htmlFor="in_stock" className="ml-2 text-sm font-medium text-[#f8dae2]">
              In Stock
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-[#920b4c] flex justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-[#f8dae2] bg-[#4d0025] hover:bg-[#920b4c]/50 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
