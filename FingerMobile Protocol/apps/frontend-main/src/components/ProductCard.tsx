import React, {} from 'react';
import { Product } from '../types';

/* eslint-disable no-unused-vars */
interface ProductCardProps {
  product: Product;
  onAddToCart?: (_productId: string) => void;
  onGiftClick?: () => void;
  onPaylinkClick?: () => void;
  onBuyClick?: () => void;
  onEmbedClick?: (_product: Product) => void;
  [key: string]: any;
}
/* eslint-enable no-unused-vars */

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onEmbedClick
}) => {
  // Function to render star ratings
  const renderRating = () => {
    const rating = product.rating ?? 0;

    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i + 1}
        className={`w-4 h-4 ${i + 1 <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="glass rounded-2xl border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group hover:-translate-y-1">
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10"></div>
        <img
          src={product.images?.[0] || product.imageUrl || 'https://placehold.co/400x300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <span className="inline-flex px-2.5 py-1 text-xs font-bold text-white bg-black/40 backdrop-blur-md rounded-full shadow-sm">
            {product.category}
          </span>
          {onEmbedClick && (
            <button
              onClick={() => onEmbedClick(product)}
              title="Embed into Postcard, Forum, or Social"
              aria-label="Embed into Postcard, Forum, or Social"
              className="p-1.5 bg-black/50 hover:bg-indigo-600 text-white rounded-full backdrop-blur-md transition shadow"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors text-lg leading-tight">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center">
          <div className="flex drop-shadow-sm">{renderRating()}</div>
          <span className="ml-2 text-sm font-medium text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            {product.price} FIC
          </span>
          <div className="flex items-center gap-1.5">
            {onEmbedClick && (
              <button
                type="button"
                className="p-2 border border-gray-300 text-gray-700 hover:text-indigo-600 hover:border-indigo-500 rounded-xl transition"
                onClick={() => onEmbedClick(product)}
                title="Embed into Postcards/Forum"
                aria-label="Embed into Postcards/Forum"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
            <button
              className="px-3.5 py-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white text-sm font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform transition-all active:scale-95"
              onClick={() => onAddToCart && onAddToCart(typeof product.id === 'string' ? product.id : String(product.id))}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
