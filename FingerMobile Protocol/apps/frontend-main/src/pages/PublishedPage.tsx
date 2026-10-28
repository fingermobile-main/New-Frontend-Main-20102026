import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

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
        // eslint-disable-next-line no-console
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
        <div className="text-slate-700 font-medium">Page not found</div>
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
            <p className="text-center text-sm text-slate-700 dark:text-slate-300 font-medium mt-2">{block.content.caption}</p>
          )}
        </div>
      );
    case 'divider':
      return <hr className="my-6 border-gray-200 dark:border-gray-700" />;
    default:
      return <div className="text-slate-700 font-medium">Unsupported content type: {block.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <article className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 sm:p-10">
          <header className="mb-6 pb-6 border-b border-slate-300">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{page.title}</h1>
            <div className="mt-4 text-sm font-bold text-slate-700">
              Published: {new Date(page.publishedAt || page.updatedAt).toLocaleDateString()}
            </div>
          </header>

          <div className="prose prose-slate max-w-none">
            {page.contentBlocks.map(block => (
              <div key={block.id}>
                {renderContentBlock(block)}
              </div>
            ))}
          </div>

          <footer className="mt-8 pt-6 border-t border-slate-300 text-sm font-bold text-slate-700">
            Last updated: {new Date(page.updatedAt).toLocaleDateString()}
          </footer>
        </article>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <span className="text-base font-black">←</span>
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: page?.title, url: window.location.href });
              }
            }}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <span className="text-base font-black">🔗</span>
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <span className="text-base font-black">⌂</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishedPage;
