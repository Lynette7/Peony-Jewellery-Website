'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, X, Star, Upload, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductInsert } from '@/types/database';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProductInsert>({
    name: '',
    description: '',
    price: 0,
    category: 'earrings',
    image: '',
    images: [],
    in_stock: true,
    featured: false,
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [carouselUploadMode, setCarouselUploadMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  const supabase = createClient();

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

  const handleMainImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const addAdditionalImage = (url: string) => {
    if (url.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url.trim()],
      }));
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      addAdditionalImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleCarouselFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingCarousel(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) continue;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
      }));
    }

    setIsUploadingCarousel(false);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.image) {
      setError('Please add a main product image');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('products').insert([formData]);

      if (error) throw error;

      router.push('/admin/products');
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Add New Product</h1>
        <p className="text-[#f8dae2]">Fill in the details below to add a new product.</p>
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

          {/* Main Image Upload */}
          <ImageUpload
            label="Main Product Image *"
            currentImage={formData.image}
            onImageUploaded={handleMainImageUpload}
          />

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-[#f8dae2] mb-2">
              Additional Images (for carousel)
            </label>
            
            {/* Mode Toggle */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setCarouselUploadMode('upload')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  carouselUploadMode === 'upload'
                    ? 'bg-[#920b4c] text-[#fcfbf9]'
                    : 'bg-[#4d0025] text-[#f8dae2] hover:bg-[#920b4c]/50'
                }`}
              >
                <Upload size={16} />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setCarouselUploadMode('url')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  carouselUploadMode === 'url'
                    ? 'bg-[#920b4c] text-[#fcfbf9]'
                    : 'bg-[#4d0025] text-[#f8dae2] hover:bg-[#920b4c]/50'
                }`}
              >
                <LinkIcon size={16} />
                <span>URL</span>
              </button>
            </div>

            {carouselUploadMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCarouselFileUpload}
                  className="hidden"
                  id="carousel-upload"
                />
                <label
                  htmlFor="carousel-upload"
                  className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-[#920b4c] bg-[#4d0025] hover:bg-[#920b4c]/20 cursor-pointer transition-colors"
                >
                  {isUploadingCarousel ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin text-[#f8dae2]" size={20} />
                      <span className="text-sm text-[#f8dae2]">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="text-[#f8dae2]" size={20} />
                      <span className="text-sm text-[#f8dae2]">Click to upload multiple images</span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
                  placeholder="https://example.com/image2.jpg"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  disabled={!newImageUrl.trim()}
                  className="px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors disabled:opacity-50 flex items-center"
                >
                  <Plus size={20} />
                </button>
              </div>
            )}
            
            {/* Image thumbnails */}
            {formData.images && formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#4d0025] border border-[#920b4c]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[#f8dae2]/70 mt-2">
              Add additional images for the product carousel. These will show after the main image.
            </p>
          </div>

          {/* Stock & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-[#4d0025] rounded-lg border border-[#920b4c]">
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
            <div className="flex items-center p-3 bg-[#4d0025] rounded-lg border border-[#920b4c]">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[#920b4c] bg-[#4d0025] border-[#920b4c] rounded focus:ring-[#f8dae2]"
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium text-[#f8dae2] flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                Featured Product
              </label>
            </div>
          </div>
          <p className="text-xs text-[#f8dae2]/70 -mt-4">
            Featured products appear on the homepage in the &quot;Featured Collection&quot; section.
          </p>
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
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Create Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
