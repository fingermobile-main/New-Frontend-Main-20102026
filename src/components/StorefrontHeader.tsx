import React from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface StorefrontHeaderProps {
  storeName?: string;
  cartCount?: number;
  // eslint-disable-next-line no-unused-vars
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onFilterClick?: () => void;
}

const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  storeName = 'My Store',
  cartCount = 0,
  onSearch,
  onCartClick,
  onFilterClick
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Store Name */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">{storeName}</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onFilterClick}>
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StorefrontHeader;
