import React, {} from 'react';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const Alert = ({
  children,
  variant = 'default',
  className = ''
}: AlertProps) => {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div
      role="alert"
      className={`border-l-4 p-4 rounded-md ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '' }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

interface AlertComponent extends React.FC<AlertProps> {
  Title: React.FC<AlertTitleProps>;
  Description: React.FC<AlertDescriptionProps>;
}

const TypedAlert = Alert as AlertComponent;
TypedAlert.Title = AlertTitle;
TypedAlert.Description = AlertDescription;

export { TypedAlert as Alert, AlertTitle, AlertDescription };
export default TypedAlert;
