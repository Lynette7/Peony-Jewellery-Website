'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
  bucket?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  label = 'Image',
  bucket = 'product-images'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentImage || '');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
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
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Make sure storage is configured in Supabase.');
    } finally {
      setIsUploading(false);
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
    setPreview(urlInput);
    onImageUploaded(urlInput);
    setUrlInput('');
  };

  const handleClear = () => {
    setPreview('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label.replace(/\s/g, '-')}`}
          />
          
          {preview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-[#4d0025] border border-[#920b4c]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setError('Failed to load image')}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
              <label
                htmlFor={`file-upload-${label.replace(/\s/g, '-')}`}
                className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#920b4c] text-[#fcfbf9] text-sm rounded-lg cursor-pointer hover:bg-[#a80d58] transition-colors"
              >
                Change
              </label>
            </div>
          ) : (
            <label
              htmlFor={`file-upload-${label.replace(/\s/g, '-')}`}
              className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-[#920b4c] bg-[#4d0025] hover:bg-[#920b4c]/20 cursor-pointer transition-colors"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-[#f8dae2]" size={32} />
                  <span className="mt-2 text-sm text-[#f8dae2]">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="text-[#f8dae2]" size={32} />
                  <span className="mt-2 text-sm text-[#f8dae2]">Click to upload image</span>
                  <span className="mt-1 text-xs text-[#f8dae2]/70">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}
            </label>
          )}
        </div>
      ) : (
        /* URL Mode */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors"
            >
              Add
            </button>
          </div>
          
          {preview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-[#4d0025] border border-[#920b4c]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setError('Failed to load image')}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
