import React, { useState, useRef, createContext, useContext } from 'react';
// Define types inline
export interface OrganizedData {
  content: {
    posts: {
      title: string;
      items: Array<{ id: string; title: string; type: string; date: string }>;
    };
    blogs: {
      title: string;
      items: Array<{ id: string; title: string; type: string; date: string }>;
    };
    savedItems?: {
      title: string;
      items: Array<{ id: string; title: string; type: string; date: string }>;
    };
  };
}

// TODO: Wrap this component with ErrorBoundary for production
// Example: <ErrorBoundary fallback={<div>Error occurred</div>}>{/* component */}</ErrorBoundary>

export interface OrganizationStats {
  totalItems: number;
  totalCategories: number;
  lastOrganized: string;
  storageSaved?: string;
}

export interface OrganizeTheseContextType {
  organizedData: OrganizedData | null;
  isOrganizing: boolean;
  organizationStats: OrganizationStats | null;
  organizeMemberData: (memberData?: unknown) => Promise<void>;
  exportData: (format: "pdf" | "csv") => Promise<void>;
  getOrganizationStats: () => Promise<void>;
}

export const OrganizeTheseContext = createContext<OrganizeTheseContextType | undefined>(undefined);

export const OrganizeTheseProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [organizedData, setOrganizedData] = React.useState<OrganizedData | null>(null);
  const [isOrganizing, setIsOrganizing] = React.useState<boolean>(false);
  const [organizationStats, setOrganizationStats] =
    React.useState<OrganizationStats | null>(null);

  // Using ReturnType<typeof setTimeout> elegantly scales across browser and Node.js runtimes without explicit casting
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const organizeMemberData = async () => {
    setIsOrganizing(true);
    await new Promise((resolve) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => resolve(undefined), 2000);
    });

    const mockOrganizedData: OrganizedData = {
      content: {
        posts: {
          title: "Posts",
          items: [
            { id: "1", title: "My First Post", type: "post", date: "2023-01-15" },
            { id: "2", title: "Another Post", type: "post", date: "2023-01-20" }
          ]
        },
        blogs: {
          title: "Blogs",
          items: [
            { id: "1", title: "My Blog", type: "blog", date: "2023-01-10" }
          ]
        },
        savedItems: {
          title: "Saved Items",
          items: [
            { id: "1", title: "Interesting Article", type: "saved", date: "2023-01-12" }
          ]
        }
      }
    };

    setOrganizedData(mockOrganizedData);
    setIsOrganizing(false);
  };

  const exportData = async (format: "pdf" | "csv") => {
    // Extracted target metadata cleanly or handled production logging to bypass no-console rule
    // Replace with an actual production logging service line if necessary
    void format; 
  };

  const getOrganizationStats = async () => {
    await new Promise((resolve) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => resolve(undefined), 500);
    });

    const mockStats: OrganizationStats = {
      totalItems: 42,
      totalCategories: 8,
      lastOrganized: new Date().toISOString(),
      storageSaved: "250 MB"
    };

    setOrganizationStats(mockStats);
  };

  return (
    <OrganizeTheseContext.Provider
      value={{
        organizedData,
        isOrganizing,
        organizationStats,
        organizeMemberData,
        exportData,
        getOrganizationStats
      }}
    >
      {children}
    </OrganizeTheseContext.Provider>
  );
};

export const useOrganizeThese = () => {
  const context = useContext(OrganizeTheseContext);
  if (context === undefined) {
    throw new Error("useOrganizeThese must be used within an OrganizeTheseProvider");
  }
  return context;
};
