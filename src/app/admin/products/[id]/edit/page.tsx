'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, X, Star, Upload, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProductUpdate } from '@/types/database';
import ImageUpload from '@/components/admin/ImageUpload';

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
    images: [],
    in_stock: true,
    featured: false,
    discount_percentage: null,
    specifications: null,
    variants: null,
  });
  const [specs, setSpecs] = useState({ material: '', color: '', design: '', properties: '', style: '' });
  const [variants, setVariants] = useState<{ name: string; image: string }[]>([]);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantImage, setNewVariantImage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [carouselUploadMode, setCarouselUploadMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
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
        images: data.images || [],
        in_stock: data.in_stock,
        featured: data.featured || false,
        discount_percentage: data.discount_percentage ?? null,
        specifications: data.specifications || null,
        variants: data.variants || null,
      });
      // Load specs
      if (data.specifications) {
        const s = data.specifications as Record<string, string>;
        setSpecs({
          material: s.material || '',
          color: s.color || '',
          design: s.design || '',
          properties: s.properties || '',
          style: s.style || '',
        });
      }
      // Load variants
      if (data.variants && Array.isArray(data.variants)) {
        setVariants(data.variants as { name: string; image: string }[]);
      }
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

  const handleMainImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (field: string, value: string) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    if (newVariantName.trim() && newVariantImage.trim()) {
      setVariants(prev => [...prev, { name: newVariantName.trim(), image: newVariantImage.trim() }]);
      setNewVariantName('');
      setNewVariantImage('');
    }
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `variant-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      setNewVariantImage(publicUrl);
    }
    e.target.value = '';
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

    setIsSaving(true);

    const hasSpecs = Object.values(specs).some(v => v.trim());
    const finalData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      image: formData.image,
      images: formData.images || [],
      in_stock: formData.in_stock,
      featured: formData.featured,
      discount_percentage: formData.discount_percentage,
      specifications: hasSpecs ? specs : null,
      variants: variants.length > 0 ? variants : null,
    };

    try {
      const { error } = await supabase
        .from('products')
        .update(finalData)
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/products');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : typeof err === 'object' && err !== null && 'message' in err ? String((err as Record<string, unknown>).message) : 'Unknown error';
      setError(`Failed to update product: ${message}`);
      console.error('Product update error:', err);
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
                <option value="sets">Jewellery Sets</option>
              </select>
            </div>
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discount_percentage" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Discount Percentage (0-100)
            </label>
            <input
              type="number"
              id="discount_percentage"
              name="discount_percentage"
              value={formData.discount_percentage ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? null : parseInt(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  discount_percentage: value !== null && !isNaN(value) ? Math.max(0, Math.min(100, value)) : null
                }));
              }}
              min="0"
              max="100"
              placeholder="e.g., 20 for 20% off"
              className="w-full px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
            />
            {formData.discount_percentage && formData.discount_percentage > 0 && formData.price && (
              <p className="mt-1 text-xs text-[#f8dae2]/70">
                Discounted price: KES {Math.round(formData.price * (1 - formData.discount_percentage / 100)).toLocaleString()}
              </p>
            )}
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
                  id="carousel-upload-edit"
                />
                <label
                  htmlFor="carousel-upload-edit"
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

          {/* Specifications (Optional) */}
          <div className="border border-[#920b4c] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#fcfbf9] mb-3">Specifications (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['material', 'color', 'design', 'properties', 'style'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-[#f8dae2] mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={specs[field]}
                    onChange={(e) => handleSpecChange(field, e.target.value)}
                    className="w-full px-3 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50 text-sm"
                    placeholder={`e.g., ${field === 'material' ? 'Sterling Silver' : field === 'color' ? 'Gold' : field === 'design' ? 'Minimalist' : field === 'properties' ? 'Hypoallergenic' : 'Bohemian'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Variants (Optional) */}
          <div className="border border-[#920b4c] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#fcfbf9] mb-3">Variants (Optional)</h3>
            <p className="text-xs text-[#f8dae2]/70 mb-3">Add different variants of this product (e.g., different colors or sizes).</p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50 text-sm"
                  placeholder="Variant name (e.g., Rose Gold)"
                />
                <button
                  type="button"
                  onClick={addVariant}
                  disabled={!newVariantName.trim() || !newVariantImage.trim()}
                  className="px-3 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors disabled:opacity-50 flex items-center text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={newVariantImage}
                  onChange={(e) => setNewVariantImage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50 text-sm"
                  placeholder="Image URL or upload"
                />
                <label className="px-3 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg text-[#f8dae2] text-sm cursor-pointer hover:bg-[#920b4c]/30 transition-colors flex items-center">
                  <Upload size={14} className="mr-1" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVariantImageUpload}
                    className="hidden"
                  />
                </label>
                {newVariantImage && (
                  <div className="w-10 h-10 rounded overflow-hidden bg-[#4d0025] border border-[#920b4c] flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={newVariantImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Variant List */}
            {variants.length > 0 && (
              <div className="mt-4 space-y-2">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-3 bg-[#4d0025] rounded-lg p-2 border border-[#920b4c]/50">
                    <div className="w-10 h-10 rounded overflow-hidden bg-[#920b4c]/30 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="flex-1 text-sm text-[#fcfbf9]">{variant.name}</span>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-1 text-[#f8dae2] hover:text-red-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
