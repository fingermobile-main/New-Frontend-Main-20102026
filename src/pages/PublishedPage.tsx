import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Define the types locally since they're missing from the main types file
interface PageContentBlock {
  id: string;
  type: "text" | "image" | "video" | "link" | "paragraph" | "divider";  // Added paragraph
  content: string | {
    text?: string;
    title?: string;
    paragraph?: string;
    src?: string;
    url?: string;
    image?: string;
    alt?: string;
    description?: string;
    caption?: string;
  };
  position: number;
  metadata?: Record<string, any>;
}

interface PublishedPageType {
  id: string;
  title: string;
  slug: string;
  contentBlocks: PageContentBlock[];
  authorId: string;  // Changed from authorName to authorId
  publishedAt: string;
  updatedAt: string;
  isPublic: boolean;
  views: number;
  likes: number;
  shares: number;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

const PublishedPage: React.FC = () => {
  const { id: pageId } = useParams<{ id: string }>();
  const [page, setPage] = useState<PublishedPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API call since the service doesn't exist
    setTimeout(() => {
      const mockPage: PublishedPageType = {
        id: pageId || 'mock-id',
        title: 'Mock Page Title',
        slug: 'mock-page',
        contentBlocks: [
          {
            id: '1',
            type: 'text',
            content: 'This is a sample heading',
            position: 1
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'This is a sample paragraph content.',
            position: 2
          },
          {
            id: '3',
            type: 'image',
            content: {
              src: 'https://placehold.co/600x400',
              alt: 'Sample image',
              caption: 'This is a sample image caption'
            },
            position: 3
          },
          {
            id: '4',
            type: 'divider',
            content: '',
            position: 4
          }
        ],
        authorId: 'mock-author',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        views: 0,
        likes: 0,
        shares: 0,
        seoMeta: {
          title: 'Mock Page Title',
          description: 'This is a mock page for demonstration purposes',
          keywords: ['mock', 'demo', 'page']
        }
      };
      setPage(mockPage);
      setLoading(false);
    }, 500);
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
      case 'text':
        // Handle different structures for content
        if (typeof block.content === 'string') {
          return <p className="text-gray-700 dark:text-gray-300 mb-4">{block.content}</p>;
        } else if (block.content && typeof block.content === 'object') {
          return <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{block.content.text || block.content.title || JSON.stringify(block.content)}</h1>;
        }
        return <p className="text-gray-700 dark:text-gray-300 mb-4">{JSON.stringify(block.content)}</p>;
      case 'paragraph':
        // Handle different structures for content
        if (typeof block.content === 'string') {
          return <p className="text-gray-700 dark:text-gray-300 mb-4">{block.content}</p>;
        } else if (block.content && typeof block.content === 'object') {
          return <p className="text-gray-700 dark:text-gray-300 mb-4">{block.content.text || block.content.paragraph || JSON.stringify(block.content)}</p>;
        }
        return <p className="text-gray-700 dark:text-gray-300 mb-4">{JSON.stringify(block.content)}</p>;
      case 'image':
        // Handle different structures for content
        let imgSrc = '';
        let imgAlt = '';
        let caption = '';
        
        if (typeof block.content === 'string') {
          imgSrc = block.content;
          imgAlt = 'Image';
        } else if (block.content && typeof block.content === 'object') {
          imgSrc = block.content.src || block.content.url || block.content.image || '';
          imgAlt = block.content.alt || block.content.description || 'Image';
          caption = block.content.caption || block.content.title || '';
        }
        
        return (
          <div className="my-4">
            <img 
              src={imgSrc} 
              alt={imgAlt} 
              className="max-w-full h-auto rounded-lg"
             />
            {caption && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</p>
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
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{page.title}</h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <span>By {page.authorId || 'Unknown Author'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(page.publishedAt).toLocaleDateString()}</span>
          </div>
        </header>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {page.contentBlocks
            .sort((a, b) => a.position - b.position)
            .map((block) => (
              <div key={block.id}>
                {renderContentBlock(block)}
              </div>
            ))
          }
        </div>
        
        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <p>Published by {page.authorId || 'Unknown Author'} on {new Date(page.publishedAt).toLocaleDateString()}</p>
        </footer>
      </article>
    </div>
  );
};

export default PublishedPage;