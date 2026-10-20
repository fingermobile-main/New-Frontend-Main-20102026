import React, {} from 'react';
import { Package, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface StorefrontCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    rating?: number;
    reviews?: number;
    category?: string;
    inStock?: boolean;
  };
  // eslint-disable-next-line no-unused-vars
  onAddToCart?: (productId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onViewDetails?: (productId: string) => void;
}

const StorefrontCard: React.FC<StorefrontCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  return (
    <Card className="border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-slate-100 border-b border-slate-200 relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-slate-500 opacity-40" />
          </div>
        )}
        {!product.inStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Category */}
        {product.category && (
          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-800 border border-slate-300 font-semibold">
            {product.category}
          </Badge>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg text-slate-900 truncate">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-slate-700 font-medium">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="text-2xl font-bold text-slate-900">${product.price.toFixed(2)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-slate-300 text-slate-800 font-semibold"
          onClick={() => onViewDetails?.(product.id)}
        >
          View Details
        </Button>
        <Button
          className="flex-1"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StorefrontCard;
