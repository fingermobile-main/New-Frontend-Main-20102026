import React, { useState, KeyboardEvent } from 'react';
interface CommandProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface CommandListProps {
  children: React.ReactNode;
  className?: string;
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

interface CommandGroupProps {
  children: React.ReactNode;
  heading?: string;
  className?: string;
}

const Command = ({ children, label = 'Command Menu', className = '' }: CommandProps) => {
  return (
    <div className={`flex h-full w-full flex-col overflow-hidden rounded-lg border border-input bg-popover text-popover-foreground ${className}`} role="dialog" aria-modal="true" aria-label={label}>
      {children}
    </div>
  );
};

const CommandInput: React.FC<CommandInputProps> = ({
  placeholder = 'Type a command or search...',
  value = '',
  onValueChange,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div className="flex items-center border-b border-input px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        className={`py-3 w-full rounded-md bg-transparent placeholder:text-muted-foreground outline-none ${className}`}
        role="combobox"
        aria-expanded="true"
        aria-controls="command-list" />
    </div>
  );
};

const CommandList: React.FC<CommandListProps> = ({ children, className = '' }) => {
  return (
    <div
      id="command-list"
      className={`overflow-y-auto overflow-x-hidden py-2 ${className}`}
      role="listbox"
    >
      {children}
    </div>
  );
};

const CommandItem: React.FC<CommandItemProps> = ({ children, onSelect, className = '' }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onSelect) {
        onSelect();
      }
    }
  };

  return (
    <div
      role="option"
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground ${
        isSelected ? 'bg-accent text-accent-foreground' : ''
      } ${className}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
    >
      {children}
    </div>
  );
};

const CommandGroup: React.FC<CommandGroupProps> = ({ children, heading, className = '' }) => {
  return (
    <div className={`overflow-hidden p-1 ${className}`} role="group" aria-labelledby={heading}>
      {heading && (
        <h2 className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</h2>
      )}
      {children}
    </div>
  );
};

interface CommandComponent extends React.FC<CommandProps> {
  Input: React.FC<CommandInputProps>;
  List: React.FC<CommandListProps>;
  Item: React.FC<CommandItemProps>;
  Group: React.FC<CommandGroupProps>;
}

const TypedCommand = Command as CommandComponent;

TypedCommand.Input = CommandInput;
TypedCommand.List = CommandList;
TypedCommand.Item = CommandItem;
TypedCommand.Group = CommandGroup;

export { TypedCommand as Command, CommandInput, CommandList, CommandItem, CommandGroup };
export default TypedCommand;
