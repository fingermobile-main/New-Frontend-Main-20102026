import React, {} from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onGiftClick?: () => void;
  onPaylinkClick?: () => void;
  onBuyClick?: () => void;
  [key: string]: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Function to render star ratings
  const renderRating = () => {
    const rating = product.rating ?? 0;

    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i + 1}
        className={`w-4 h-4 ${i + 1 <= rating ? "text-yellow-400" : "text-gray-300"}`}
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
          src={product.images?.[0] || product.imageUrl || 'https://placehold.co/400x300'}
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
        <div className="mt-2 flex items-center">
          <div className="flex">{renderRating()}</div>
          <span className="ml-1 text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {product.price} FIC
          </span>
          <button
            className="px-3 py-1 bg-brand-blue text-white text-sm rounded-md hover:bg-blue-700"
            onClick={() => onAddToCart && onAddToCart(typeof product.id === 'string' ? product.id : String(product.id))}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
