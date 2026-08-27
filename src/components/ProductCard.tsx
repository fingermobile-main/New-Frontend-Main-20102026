import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, variantId?: string) => void;
  onGiftClick?: () => void;
  onPaylinkClick?: () => void;
  onBuyClick?: () => void;
  selectedVariantId?: string; // ID of the variant currently selected in the parent context
  onVariantChange?: (variantId: string) => void; // Callback to notify parent of selection change
  [key: string]: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  selectedVariantId, 
  onVariantChange 
}) => {
  // Internal state for selected variant, defaults to prop or first variant
  const [currentVariantId, setCurrentVariantId] = useState<string | undefined>(selectedVariantId || product.variants?.[0]?.id);

  // Sync internal state with prop changes
  useEffect(() => {
    if (selectedVariantId !== currentVariantId) {
      setCurrentVariantId(selectedVariantId);
    }
  }, [selectedVariantId]);

  // Find the currently selected variant object
  const selectedVariant = product.variants?.find(v => v.id === currentVariantId);

  // Determine the price and image to display
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  // Fixed image access: variants.images is string[], not {url: string}[]
  const displayImage = selectedVariant && selectedVariant.images && selectedVariant.images[0] 
    ? selectedVariant.images[0] // Access the string directly
    : (product.images?.[0] || product.imageUrl || 'https://placehold.co/400x300');

  // Handle variant selection change
  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariantId = e.target.value;
    setCurrentVariantId(newVariantId);
    if (onVariantChange) {
      onVariantChange(newVariantId);
    }
  };

  // Function to render star ratings - Fixed to handle union type
  const renderRating = () => {
    let averageRating = 0;
    if (typeof product.rating === 'object' && product.rating !== null) {
        averageRating = product.rating.average;
    } else if (typeof product.rating === 'number') {
        averageRating = product.rating;
    }

    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i + 1}
        className={`w-4 h-4 ${i + 1 <= averageRating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover"
         />
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-brand-blue bg-blue-100 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Variant Selector */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-2">
            <select 
              value={currentVariantId || ''} 
              onChange={handleVariantChange}
              className="w-full text-sm border border-gray-300 rounded-md p-1"
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} ({variant.options ? Object.values(variant.options).join(', ') : ''}) - {variant.price} FIC
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-2 flex items-center">
          <div className="flex">{renderRating()}</div>
          {/* Fixed rating count access - handle union type */}
          <span className="ml-1 text-sm text-gray-500">
            ({typeof product.rating === 'object' && product.rating !== null ? product.rating.count : product.reviewCount || 0})
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {displayPrice} FIC
          </span>
          <button
            className="px-3 py-1 bg-brand-blue text-white text-sm rounded-md hover:bg-blue-700"
            onClick={() => onAddToCart && onAddToCart(product.id, currentVariantId)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;