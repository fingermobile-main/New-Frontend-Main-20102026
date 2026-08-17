import React, { useEffect, useState } from 'react';
import { ownitService, OwnitEntry } from '../../services/ownitService';

interface ProductDetailProps {
  productId: string;
  onClose?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onClose }) => {
  const [product, setProduct] = useState<OwnitEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'warranty' | 'history'>('details');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await ownitService.getEntry(productId);
      setProduct(data || null);
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isWarrantyActive = (product: OwnitEntry) => {
    if (!product.warranty_end_date) return false;
    return new Date(product.warranty_end_date) > new Date();
  };

  const getWarrantyStatus = (product: OwnitEntry) => {
    if (!product.warranty_end_date) return { label: 'No Warranty', color: 'bg-gray-100 text-gray-800' };
    
    const endDate = new Date(product.warranty_end_date);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (daysLeft < 30) {
      return { label: `Expiring in ${daysLeft} days`, color: 'bg-yellow-100 text-yellow-800' };
    }
    return { label: `Active (${daysLeft} days left)`, color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error || 'Product not found'}</p>
        <button
          onClick={loadProduct}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const warrantyStatus = getWarrantyStatus(product);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{product.title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Product Image Placeholder */}
      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-8xl">📱</div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'details', label: 'Details' },
            { id: 'warranty', label: 'Warranty' },
            { id: 'history', label: 'History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand</p>
                <p className="font-semibold text-gray-900">{product.brand}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Model</p>
                <p className="font-semibold text-gray-900">{product.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Serial Number</p>
                <p className="font-mono text-sm text-gray-900">{product.serial_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {product.category_id}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Purchase Date</p>
                <p className="font-semibold text-gray-900">
                  {product.purchase_date ? formatDate(product.purchase_date) : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Price Paid</p>
                <p className="font-semibold text-gray-900">
                  {product.price_paid ? `$${product.price_paid.toFixed(2)}` : 'N/A'}
                </p>
              </div>
            </div>

            {product.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="text-gray-900 whitespace-pre-wrap">{product.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${warrantyStatus.color}`}>
              <p className="font-semibold">{warrantyStatus.label}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Warranty Start</p>
                <p className="font-semibold text-gray-900">
                  {product.warranty_start_date ? formatDate(product.warranty_start_date) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Warranty End</p>
                <p className="font-semibold text-gray-900">
                  {product.warranty_end_date ? formatDate(product.warranty_end_date) : 'N/A'}
                </p>
              </div>
            </div>

            {product.warranty_provider && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Provider</p>
                <p className="font-semibold text-gray-900">{product.warranty_provider}</p>
              </div>
            )}

            {isWarrantyActive(product) && (
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                File Warranty Claim
              </button>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-8">
            <p className="text-gray-500">No history available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;