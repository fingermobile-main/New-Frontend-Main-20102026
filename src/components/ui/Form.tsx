import React, {} from 'react';
import { Label } from './Label';

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

interface FormMessageProps {
  children: React.ReactNode;
  className?: string;
}

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Form = ({ children, onSubmit, className = '' }: FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

const FormItem: React.FC<FormItemProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

const FormLabel: React.FC<FormLabelProps> = ({ children, htmlFor, className = '' }) => {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
    </Label>
  );
};

const FormControl: React.FC<FormControlProps> = ({ children, className = '' }) => {
  // Clone the child element and add the form control styling
  return React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
      className: `${(children as any).props.className || ''} ${className}`
    })
    : <>{children}</>;
};

const FormMessage: React.FC<FormMessageProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm font-medium text-destructive ${className}`}>
      {children}
    </p>
  );
};

const FormDescription: React.FC<FormDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

interface FormComponent extends React.FC<FormProps> {
  Field: React.FC<FormFieldProps>;
  Item: React.FC<FormItemProps>;
  Label: React.FC<FormLabelProps>;
  Control: React.FC<FormControlProps>;
  Message: React.FC<FormMessageProps>;
  Description: React.FC<FormDescriptionProps>;
}

const TypedForm = Form as FormComponent;
TypedForm.Field = FormField;
TypedForm.Item = FormItem;
TypedForm.Label = FormLabel;
TypedForm.Control = FormControl;
TypedForm.Message = FormMessage;
TypedForm.Description = FormDescription;

export { TypedForm as Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription };
export default TypedForm;
