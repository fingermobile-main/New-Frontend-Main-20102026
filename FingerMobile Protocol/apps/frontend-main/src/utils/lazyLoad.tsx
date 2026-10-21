import React, { useState, useRef, useEffect, ElementType } from 'react';
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  component?: ElementType;
  [key: string]: any;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = null,
  component: WrapperComponent = 'div',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  if (isVisible) {
    if (WrapperComponent !== 'div') {
      return <WrapperComponent ref={ref} {...props}>{children}</WrapperComponent>;
    }
    return <div ref={ref} {...props}>{children}</div>;
  }

  return <>{fallback}</>;
};

LazyLoad.displayName = 'LazyLoad';

export { LazyLoad };
