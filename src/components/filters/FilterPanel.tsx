import React, { useState } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterPanelProps {
  categories?: FilterOption[];
  tags?: FilterOption[];
  priceRange?: [number, number];
  onApplyFilters?: (filters: any) => void;
  onClearFilters?: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories = [
    { id: 'tech', label: 'Technology', count: 1234 },
    { id: 'business', label: 'Business', count: 856 },
    { id: 'design', label: 'Design', count: 643 },
    { id: 'marketing', label: 'Marketing', count: 521 }
  ],
  tags = [
    { id: 'ai', label: 'AI', count: 234 },
    { id: 'startup', label: 'Startup', count: 189 },
    { id: 'innovation', label: 'Innovation', count: 156 }
  ],
  priceRange = [0, 1000],
  onApplyFilters,
  onClearFilters
}) => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [price, setPrice] = React.useState<[number, number]>(priceRange);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleApply = () => {
    onApplyFilters?.({
      categories: selectedCategories,
      tags: selectedTags,
      priceRange: price
    });
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setPrice(priceRange);
    onClearFilters?.();
  };

  const activeFiltersCount = selectedCategories.length + selectedTags.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.label}
                  </label>
                </div>
                {category.count && (
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag.id)}
              >
                {tag.label}
                {selectedTags.includes(tag.id) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Price Range</Label>
          <Slider
            value={price}
            onValueChange={(value: number[]) => setPrice(value as [number, number])}
            max={priceRange[1]}
            step={10}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
