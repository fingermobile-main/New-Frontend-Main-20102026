import React, {} from 'react';
import { Tag, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CategoryHeaderProps {
  title: string;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onFilterClick?: () => void;
  showFilter?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  categories = ['All', 'Trending', 'Recent', 'Popular'],
  activeCategory = 'All',
  onCategoryChange,
  onFilterClick,
  showFilter = true
}) => {
  return (
    <div className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Title */}
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1 mx-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange?.(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Filter Button */}
        {showFilter && (
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Active Category Indicator */}
      <div className="px-4 pb-2">
        <Badge variant="secondary" className="text-xs">
          <Tag className="h-3 w-3 mr-1" />
          Showing: {activeCategory}
        </Badge>
      </div>
    </div>
  );
};

export default CategoryHeader;
