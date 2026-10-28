import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { Product } from '../types';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Star,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface Review {
  id: string;
  memberId: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal } = useAppContext();

  const {
    products,
    loading: marketplaceLoading,
    // eslint-disable-next-line no-unused-vars
    getProductById,
    handleAddToCart
  } = useMarketplace();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qaList, setQaList] = useState<QuestionAnswer[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { default: marketplaceService } = await import('../services/marketplaceService');
        const foundProduct = await marketplaceService.getProductById(id);

        if (foundProduct) {
          // Normalize API response to fit the frontend type, e.g. mapping image_url to images array
          const fp: any = foundProduct;
          const productData = {
            ...fp,
            images: fp.images || (fp.image_url ? [fp.image_url] : []),
            rating: fp.avg_rating || fp.rating || 0,
            reviewCount: fp.review_count || fp.reviewCount || 0,
            stock: fp.stock_quantity || fp.stock || 0
          };
          setProduct(productData as any);
        } else {
          // Fallback
          const prod = products.find(p => p.id === id);
          setProduct(prod || null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load product from backend, using context fallback', err);
        const prod = products.find(p => p.id === id);
        setProduct(prod || null);
      }

      setReviews([
        { id: '1', memberId: 'member1', rating: 5, content: 'Great product!', createdAt: '2023-01-01' },
        { id: '2', memberId: 'member2', rating: 4, content: 'Good quality.', createdAt: '2023-01-02' }
      ]);

      setQaList([
        { id: 'q1', question: 'Is this product durable?', answer: 'Yes, very durable material.', createdAt: '2023-01-03' },
        { id: 'q2', question: 'What colors are available?', answer: 'Available in blue and red.', createdAt: '2023-01-04' }
      ]);

      setLoading(false);
    };

    void loadProduct();
  }, [id, products]);

  const handleAddToCartClick = () => {
    if (product && handleAddToCart) {
      handleAddToCart(product, quantity);
    }
    openModal('cart');
  };

  if (loading || marketplaceLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="min-h-[44px] px-3 py-2 inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer"
          >
            <span>&larr;</span> Back to Products
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2 p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(0)}
                      className="w-full h-64 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                      aria-label={`View ${product.name || ''} image 1`}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name || ''}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  </div>
                  <div className="col-span-1">
                    <div className="grid grid-rows-2 gap-4 h-full">
                      {product.images.slice(1, 3).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(idx + 1)}
                          className="w-full h-full block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                          aria-label={`View ${product.name || ''} image ${idx + 2}`}
                        >
                          <img
                            src={img}
                            alt={`${product.name || ''}-${idx+1}`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-slate-700">No images available</span>
                </div>
              )}
            </div>

            {/* Selected Image Preview */}
            <div className="mb-6">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name || ''}
                  className="w-full h-80 object-contain rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-80 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-slate-700">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-amber-400' : 'text-slate-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="border-y border-slate-200 py-4">
              <p className="text-3xl font-black text-slate-900 tracking-tight">${product.price.toFixed(2)}</p>
              <p className="text-slate-700 font-medium mt-2 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center flex-wrap gap-3">
                <label htmlFor="quantity-input" className="font-bold text-slate-900 text-sm">Quantity:</label>
                <input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="min-h-[44px] border border-slate-300 rounded-xl p-2 w-20 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <span className="text-sm font-bold text-slate-700">Available: {product.stock}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="min-h-[44px] flex-1 py-3 px-6 font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => openModal('cart')}
                  className="min-h-[44px] flex-1 py-3 px-6 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-300 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Category</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.category}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Seller</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.seller?.name || 'N/A'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Popularity</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.popularity}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 border-t border-slate-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-slate-300 dark:border-gray-700 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-400'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{review.createdAt}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 font-medium">No reviews yet.</p>
          )}
        </div>

        {/* Q&A Section */}
        <div className="p-6 border-t border-slate-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions & Answers</h2>

          {qaList.length > 0 ? (
            <div className="space-y-4">
              {qaList.map(qa => (
                <div key={qa.id}>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">{qa.question}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{qa.answer}</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-2">{qa.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 font-medium">No questions yet. Ask the first one!</p>
          )}
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
        <button
          onClick={() => navigate('/products')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Catalog"
        >
          <ArrowLeft className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-semibold mt-0.5">Catalog</span>
        </button>
        <button
          onClick={handleAddToCartClick}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Cart"
        >
          <ShoppingCart className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] font-semibold mt-0.5">Add Cart</span>
        </button>
        <button
          onClick={() => openModal('cart')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Buy"
        >
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-semibold mt-0.5">Buy Now</span>
        </button>
        <button
          onClick={() => navigate('/storefront')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Stores"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-semibold mt-0.5">Stores</span>
        </button>
      </div>
    </div>
  </div>
);
};

export default ProductDetailPage;
