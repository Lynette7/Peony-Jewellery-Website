'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, AlertCircle, Package, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8dae2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#fcfbf9]">Products</h1>
          <p className="text-[#f8dae2]">Manage your jewelry inventory</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center space-x-2 bg-[#920b4c] text-[#fcfbf9] px-4 py-2 rounded-lg hover:bg-[#a80d58] transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
          >
            <option value="all">All Categories</option>
            <option value="earrings">Earrings</option>
            <option value="necklaces">Necklaces</option>
            <option value="rings">Rings</option>
            <option value="bracelets">Bracelets</option>
            <option value="sets">Jewellery Sets</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto mb-4 text-[#920b4c]" size={48} />
            <h3 className="text-lg font-medium text-[#fcfbf9] mb-2">No products found</h3>
            <p className="text-[#f8dae2] mb-4">
              {products.length === 0
                ? 'Get started by adding your first product.'
                : 'Try adjusting your search or filter.'}
            </p>
            {products.length === 0 && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center space-x-2 bg-[#920b4c] text-[#fcfbf9] px-4 py-2 rounded-lg hover:bg-[#a80d58] transition-colors"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4d0025] border-b border-[#920b4c]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#920b4c]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#920b4c]/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#4d0025] flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#fcfbf9]">{product.name}</p>
                          <p className="text-sm text-[#f8dae2] line-clamp-1 max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-[#f8dae2]">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {product.discount_percentage && product.discount_percentage > 0 ? (
                          <>
                            <span className="text-muted-foreground line-through text-sm">
                              {formatPrice(product.price)}
                            </span>
                            <span className="font-medium text-[#fcfbf9]">
                              {formatPrice(Math.round(product.price * (1 - product.discount_percentage / 100)))}
                            </span>
                            <span className="text-xs text-red-400">-{product.discount_percentage}%</span>
                          </>
                        ) : (
                          <span className="font-medium text-[#fcfbf9]">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.in_stock
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-red-900/50 text-red-300'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-900/50 text-yellow-300 flex items-center">
                            <Star size={12} className="mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-[#f8dae2] hover:text-[#fcfbf9] hover:bg-[#920b4c]/50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </Link>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 text-sm bg-[#920b4c] text-[#fcfbf9] rounded hover:bg-[#a80d58]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-[#f8dae2] hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-[#f8dae2]">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
