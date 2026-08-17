import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';
import type {
  Member,
  Post,
  Comment,
  BlogCategory,
  ForumCategory
} from '../services/dataImportService';
import { useImportedData } from '../hooks/useImportedData';

export interface ImportedDataContextType {
  members: Member[];
  posts: Post[];
  comments: Comment[];
  blogCategories: BlogCategory[];
  forumCategories: ForumCategory[];
  loading: boolean;
  error: string | null;
}

export const ImportedDataContext = React.createContext<
  ImportedDataContextType | undefined
>(undefined);

export const useImportedDataContext = () => {
  const context = React.useContext(ImportedDataContext);
  if (context === undefined) {
    throw new Error(
      "useImportedDataContext must be used within an ImportedDataProvider",
    );
  }
  return context;
};

export const ImportedDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { showToast } = useAppContext();
  const { data, loading, error } = useImportedData();

  React.useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const contextValue: ImportedDataContextType = {
    members: data?.members || [],
    posts: data?.posts || [],
    comments: data?.comments || [],
    blogCategories: data?.blogCategories || [],
    forumCategories: data?.forumCategories || [],
    loading,
    error
  };

  return (
    <ImportedDataContext.Provider value={contextValue}>
      {children}
    </ImportedDataContext.Provider>
  );
};
