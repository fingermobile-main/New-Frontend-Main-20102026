import React, {} from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './Dialog';

interface AlertDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AlertDialog = ({ children, open, onOpenChange }: AlertDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children, className = '' }) => {
  return (
    <DialogContent className={className}>
      {children}
    </DialogContent>
  );
};

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children, className = '' }) => {
  return (
    <DialogTitle className={`text-lg font-semibold ${className}`}>
      {children}
    </DialogTitle>
  );
};

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children, className = '' }) => {
  return (
    <DialogDescription className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </DialogDescription>
  );
};

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
};

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ children, onClick, className = '' }) => {
  return (
    <button
      className={`mt-2 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface AlertDialogComponent extends React.FC<AlertDialogProps> {
  Content: React.FC<AlertDialogContentProps>;
  Header: React.FC<AlertDialogHeaderProps>;
  Title: React.FC<AlertDialogTitleProps>;
  Description: React.FC<AlertDialogDescriptionProps>;
  Footer: React.FC<AlertDialogFooterProps>;
  Action: React.FC<AlertDialogActionProps>;
  Cancel: React.FC<AlertDialogCancelProps>;
}

const TypedAlertDialog = AlertDialog as AlertDialogComponent;

TypedAlertDialog.Content = AlertDialogContent;
TypedAlertDialog.Header = AlertDialogHeader;
TypedAlertDialog.Title = AlertDialogTitle;
TypedAlertDialog.Description = AlertDialogDescription;
TypedAlertDialog.Footer = AlertDialogFooter;
TypedAlertDialog.Action = AlertDialogAction;
TypedAlertDialog.Cancel = AlertDialogCancel;

export { TypedAlertDialog as AlertDialog };
