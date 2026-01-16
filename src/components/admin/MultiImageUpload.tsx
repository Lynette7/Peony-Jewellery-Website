'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  label?: string;
  bucket?: string;
}

export default function MultiImageUpload({ 
  images,
  onImagesChange,
  label = 'Additional Images',
  bucket = 'product-images'
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setIsUploading(true);

    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
      }

      if (uploadedUrls.length < files.length) {
        setError(`Some images failed to upload. Uploaded ${uploadedUrls.length} of ${files.length}.`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Make sure storage is configured in Supabase.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setError('');
    onImagesChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#f8dae2]">{label}</label>

      {/* Mode Toggle */}
      <div className="flex space-x-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMode('upload')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            uploadMode === 'upload'
              ? 'bg-[#920b4c] text-[#fcfbf9]'
              : 'bg-[#4d0025] text-[#f8dae2] hover:bg-[#920b4c]/50'
          }`}
        >
          <Upload size={16} />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            uploadMode === 'url'
              ? 'bg-[#920b4c] text-[#fcfbf9]'
              : 'bg-[#4d0025] text-[#f8dae2] hover:bg-[#920b4c]/50'
          }`}
        >
          <LinkIcon size={16} />
          <span>URL</span>
        </button>
      </div>

      {/* Upload Mode */}
      {uploadMode === 'upload' ? (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="multi-file-upload"
          />
          
          <label
            htmlFor="multi-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-[#920b4c] bg-[#4d0025] hover:bg-[#920b4c]/20 cursor-pointer transition-colors"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-[#f8dae2]" size={28} />
                <span className="mt-2 text-sm text-[#f8dae2]">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="text-[#f8dae2]" size={28} />
                <span className="mt-2 text-sm text-[#f8dae2]">Click to upload multiple images</span>
                <span className="mt-1 text-xs text-[#f8dae2]/70">PNG, JPG, WEBP up to 5MB each</span>
              </div>
            )}
          </label>
        </div>
      ) : (
        /* URL Mode */
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlSubmit();
              }
            }}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors disabled:opacity-50 flex items-center"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden bg-[#4d0025] border border-[#920b4c]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%234d0025" width="100" height="100"/><text fill="%23f8dae2" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">Error</text></svg>';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={14} />
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#f8dae2]/70">
        These images will appear in the product carousel after the main image. Drag order coming soon.
      </p>
    </div>
  );
}
