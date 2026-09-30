import React, { useState } from 'react';
interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  activeItems?: string[];
  toggleItem?: (value: string) => void;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

const Accordion = ({
  children,
  type = 'single',
  collapsible = true,
  className = ''
}: AccordionProps) => {
  const [activeItems, setActiveItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      if (activeItems.includes(value)) {
        setActiveItems(collapsible ? [] : activeItems);
      } else {
        setActiveItems([value]);
      }
    } else {
      if (activeItems.includes(value)) {
        setActiveItems(activeItems.filter(item => item !== value));
      } else {
        setActiveItems([...activeItems, value]);
      }
    }
  };

  // Pass down the state and toggle function to child components
  const cloneChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        activeItems,
        toggleItem
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {cloneChildren}
    </div>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  className = '',
  activeItems = [],
  toggleItem = () => {}
}) => {
  const isActive = activeItems.includes(value);

  const cloneChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if ((child.type as any).name === 'AccordionTrigger') {
        return React.cloneElement(child as React.ReactElement, {
          isActive,
          onClick: () => toggleItem(value)
        });
      } else if ((child.type as any).name === 'AccordionContent') {
        return React.cloneElement(child as React.ReactElement, {
          isActive
        });
      }
    }
    return child;
  });

  return (
    <div className={`border-b ${className}`}>
      {cloneChildren}
    </div>
  );
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className = '',
  isActive,
  onClick
}) => {
  return (
    <div
      className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
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
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
      >
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </div>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  isActive
}) => {
  if (!isActive) return null;

  return (
    <div className={`pb-4 pt-0 ${className}`}>
      {children}
    </div>
  );
};

interface AccordionComponent extends React.FC<AccordionProps> {
  Item: React.FC<AccordionItemProps>;
  Trigger: React.FC<AccordionTriggerProps>;
  Content: React.FC<AccordionContentProps>;
}

const TypedAccordion = Accordion as AccordionComponent;
TypedAccordion.Item = AccordionItem;
TypedAccordion.Trigger = AccordionTrigger;
TypedAccordion.Content = AccordionContent;

export { TypedAccordion as Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export default TypedAccordion;
