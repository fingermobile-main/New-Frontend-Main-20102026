import React, { useEffect, useRef, useState } from 'react';
interface InputOTPProps {
  length: number;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

interface InputOTPGroupProps {
  children: React.ReactNode;
}

interface InputOTPSlotProps {
  index: number;
  isActive?: boolean;
  hasFakeCaret?: boolean;
}

const InputOTP = ({ 
  length, 
  onChange, 
  onComplete, 
  className = '', 
  disabled = false 
}: InputOTPProps) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange(values.join(''));
    
    if (values.every(val => val !== '') && onComplete) {
      onComplete(values.join(''));
    }
  }, [values, onChange, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const inputValue = e.target.value;
    if (inputValue.length > 1) {
      // If user pastes a multi-digit value
      const pasteValues = inputValue.split('').slice(0, length - index);
      const newValues = [...values];
      pasteValues.forEach((val, i) => {
        if (index + i < length) {
          newValues[index + i] = val;
        }
      });
      setValues(newValues);
      
      // Focus the last filled input
      const nextIndex = Math.min(index + pasteValues.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newValues = [...values];
      newValues[index] = inputValue;
      setValues(newValues);
      
      // Move to next input if current is filled
      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // Move to previous input when backspacing on an empty field
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          disabled={disabled}
          className="h-10 w-10 rounded-md border border-input text-center text-sm transition-all focus:outline-none focus:ring-1 focus:ring-ring"
        />
      ))}
    </div>
  );
};

const InputOTPGroup: React.FC<InputOTPGroupProps> = ({ children }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

const InputOTPSlot: React.FC<InputOTPSlotProps> = ({ 
  index, 
  isActive = false, 
  hasFakeCaret = false 
}) => {
  return (
    <div 
      className={`relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md ${
        isActive ? 'z-10 ring-1 ring-ring' : 'border-input'
      }`}
    >
      {/* Placeholder for the actual digit */}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
};

interface InputOTPComponent extends React.FC<InputOTPProps> {
  Group: React.FC<InputOTPGroupProps>;
  Slot: React.FC<InputOTPSlotProps>;
}

const TypedInputOTP = InputOTP as InputOTPComponent;
TypedInputOTP.Group = InputOTPGroup;
TypedInputOTP.Slot = InputOTPSlot;

export { TypedInputOTP as InputOTP, InputOTPGroup, InputOTPSlot };