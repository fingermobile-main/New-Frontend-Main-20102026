import React, { useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  id, 
  value = [], 
  onChange, 
  options, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={toggleDropdown}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>
          {value.length > 0 
            ? `${value.length} selected` 
            : 'Select options...'}
        </span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div key={option.value} className="flex items-center p-2 hover:bg-gray-100">
              <input
                type="checkbox"
                id={`checkbox-${option.value}`}
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
                className="mr-2"
              />
              <label htmlFor={`checkbox-${option.value}`} className="text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};