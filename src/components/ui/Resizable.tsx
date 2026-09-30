import React, { useState } from 'react';
interface ResizablePanelGroupProps {
  children: React.ReactNode;
  className?: string;
  direction: 'horizontal' | 'vertical';
}

interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
}

interface ResizablePanelProps {
  children: React.ReactNode;
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  order?: number;
}

const ResizablePanelGroup = ({
  children,
  className = '',
  direction = 'horizontal'
}: ResizablePanelGroupProps) => {
  return (
    <div
      data-panel-group=""
      className={`flex h-full w-full data-[panel-group-direction=vertical]:flex-col ${direction === 'vertical' ? 'flex-col' : 'flex-row'} ${className}`}
    >
      {children}
    </div>
  );
};

const ResizableHandle: React.FC<ResizableHandleProps> = ({
  className = '',
  withHandle = false
}) => {
  return (
    <div
      data-panel-resize-handle=""
      className={`relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 ${className}`}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <svg
            width="3"
            height="8"
            viewBox="0 0 3 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-border-foreground"
          >
            <path
              d="M1.5 1C1.77614 1 2 1.22386 2 1.5C2 1.77614 1.77614 2 1.5 2C1.22386 2 1 1.77614 1 1.5C1 1.22386 1.22386 1 1.5 1Z"
              fill="currentColor"
            ></path>
            <path
              d="M1.5 4C1.77614 4 2 4.22386 2 4.5C2 4.77614 1.77614 5 1.5 5C1.22386 5 1 4.77614 1 4.5C1 4.22386 1.22386 4 1.5 4Z"
              fill="currentColor"
            ></path>
            <path
              d="M1.5 7C1.77614 7 2 7.22386 2 7.5C2 7.77614 1.77614 8 1.5 8C1.22386 8 1 7.77614 1 7.5C1 7.22386 1.22386 7 1.5 7Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  className = '',
  defaultSize = 50,
  minSize = 0,
  maxSize = 100
}) => {
  const [size, setSize] = useState(defaultSize);

  return (
    <div
      className={`relative h-full w-full flex-1 ${className}`}
      style={{
        flexBasis: `${size}%`
      }}
    >
      {children}
    </div>
  );
};

interface ResizablePanelGroupComponent extends React.FC<ResizablePanelGroupProps> {
  Handle: React.FC<ResizableHandleProps>;
  Panel: React.FC<ResizablePanelProps>;
}

const TypedResizablePanelGroup = ResizablePanelGroup as ResizablePanelGroupComponent;
TypedResizablePanelGroup.Handle = ResizableHandle;
TypedResizablePanelGroup.Panel = ResizablePanel;

export { TypedResizablePanelGroup as ResizablePanelGroup, ResizableHandle, ResizablePanel };
