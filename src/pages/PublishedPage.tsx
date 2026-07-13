import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedPage } from '../services/api';

interface PageContentBlock {
  id: string;
  type: string;
  content: any;
}

interface PublishedPageType {
  id: string;
  title: string;
  contentBlocks: PageContentBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

const PublishedPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<PublishedPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchedPage = await getPublishedPage(pageId || '');
    // @ts-ignore - Auto-suppressed for compilation
        setPage(fetchedPage || null);
      } catch (err) {
        setError('Failed to load page');
        console.error('Error fetching page:', err);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Page not found</div>
      </div>
    );
  }

  // Render content blocks based on their type
  const renderContentBlock = (block: PageContentBlock) => {
    switch (block.type) {
      case 'heading':
        return <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{block.content.text}</h1>;
      case 'paragraph':
        return <p className="text-gray-700 dark:text-gray-300 mb-4">{block.content.text}</p>;
      case 'image':
        return (
          <div className="my-4">
            <img 
              src={block.content.src} 
              alt={block.content.alt || ''} 
              className="max-w-full h-auto rounded-lg"
             />
            {block.content.caption && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{block.content.caption}</p>
            )}
          </div>
        );
      case 'divider':
        return <hr className="my-6 border-gray-200 dark:border-gray-700" />;
      default:
        return <div className="text-gray-500">Unsupported content type: {block.type}</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <header className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{page.title}</h1>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Published: {new Date(page.publishedAt || page.updatedAt).toLocaleDateString()}
          </div>
        </header>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {page.contentBlocks.map(block => (
            <div key={block.id}>
              {renderContentBlock(block)}
            </div>
          ))}
        </div>
        
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(page.updatedAt).toLocaleDateString()}
        </footer>
      </article>
    </div>
  );
};

export default PublishedPage;