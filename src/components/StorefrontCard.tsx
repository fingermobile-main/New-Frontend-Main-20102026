import React, {} from 'react';
import { Package, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
  onAddToCart?: (productId: string) => void;
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
          i < rating ? "text-yellow-500 fill-current" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-muted relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
           />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground opacity-20" />
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
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
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
