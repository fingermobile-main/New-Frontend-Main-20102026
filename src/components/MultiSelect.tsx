import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  searchable?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  maxSelections,
  searchable = true
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelections && selected.length >= maxSelections) {
        return;
      }
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectedLabels = selected.map(
    (value) => options.find((o) => o.value === value)?.label || value
  );

  return (
    <div className="relative">
      {/* Selected Items Display */}
      <div
        className="min-h-[40px] p-2 border border-slate-300 rounded-lg cursor-pointer bg-white hover:border-slate-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}
      >
        {selected.length === 0 ? (
          <span className="text-slate-600 font-medium">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedLabels.map((label, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer bg-slate-100 text-slate-800 border border-slate-300 font-semibold hover:bg-destructive hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(selected[index]);
                }}
              >
                {label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-slate-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 border border-slate-300 rounded text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options */}
          <div className="p-2 space-y-1">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center justify-between p-2 rounded cursor-pointer text-slate-900 font-medium hover:bg-slate-100 ${
                  selected.includes(option.value) ? 'bg-slate-100 font-semibold text-slate-900' : ''
                }`}
                onClick={() => handleToggle(option.value)} role="button" tabIndex={0}
              >
                <span>{option.label}</span>
                {selected.includes(option.value) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="text-center text-slate-600 font-medium py-4">
                No options found
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-2 border-t border-slate-200 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange([]);
                setIsOpen(false);
              }}
              className="text-slate-700 hover:text-slate-900"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Selection Count */}
      {maxSelections && (
        <div className="mt-1 text-xs text-slate-700 font-medium">
          {selected.length}/{maxSelections} selected
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
