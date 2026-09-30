import React, {} from 'react';
import { TrendingUp, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

interface SortOptionsProps {
  onSortChange?: (sortBy: string, order: 'asc' | 'desc') => void;
  onFilterChange?: (filter: string) => void;
  currentSort?: string;
  currentFilter?: string;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  onSortChange,
  onFilterChange,
  currentSort = 'recent',
  currentFilter = 'all'
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Sort & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={currentSort} onValueChange={(value) => onSortChange?.(value, 'desc')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter By</label>
          <Select value={currentFilter} onValueChange={onFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Custom Date Range
        </Button>
      </CardContent>
    </Card>
  );
};

export default SortOptions;
