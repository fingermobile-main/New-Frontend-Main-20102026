import React, { useState, createContext, useContext, ReactNode } from 'react';
interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={toastStyle}>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastComponent: React.FC<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }> = ({ 
  message, 
  type 
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderRadius: '6px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxWidth: '400px',
    wordWrap: 'break-word',
    display: 'flex',
    alignItems: 'center'
  };

  const typeStyles: Record<string, React.CSSProperties> = {
    success: { ...baseStyle, backgroundColor: '#4CAF50' },
    error: { ...baseStyle, backgroundColor: '#F44336' },
    info: { ...baseStyle, backgroundColor: '#2196F3' },
    warning: { ...baseStyle, backgroundColor: '#FF9800' }
  };

  const style = typeStyles[type] || typeStyles.info;

  return <div style={style}>{message}</div>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Export Toast component as default for backward compatibility
const Toast = () => null;
export default Toast;