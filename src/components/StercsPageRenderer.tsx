import React, { useEffect, useState, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Real components we'll map
import ForumHeader from '../layouts/ForumHeader';
import ForumLeftSidebar from '../layouts/ForumLeftSidebar';
import ForumRightSidebar from '../layouts/ForumRightSidebar';
import ForumPage from '../pages/ForumPage';
import AdBanner from './AdBanner';
import FixedAdBanner from './FixedAdBanner';

interface StercsPageRendererProps {
  slug: string;
  children: ReactNode; // Fallback children
}

const componentMap: Record<string, React.FC<any>> = {
  'ForumHeader': ForumHeader,
  'ForumLeftSidebar': ForumLeftSidebar,
  'ForumRightSidebar': ForumRightSidebar,
  'ForumFeed': ForumPage,
  'AdBanner': (props) => <AdBanner variant="large" title="Platform Canary Ad" description="Dynamic ad placeholder" imageUrl="https://i.pravatar.cc/800?img=42" {...props} />,
  'FixedAdBanner': FixedAdBanner,
  'Header': ({ content, styles }) => <h1 style={{ ...styles, width: '100%' }} className="text-2xl font-bold">{content}</h1>,
  'Hero Section': ({ content, styles }) => <div style={{ ...styles, width: '100%' }} className="text-xl">{content}</div>,
  'Text Block': ({ content, styles }) => <p style={{ ...styles, width: '100%' }}>{content}</p>,
  'Image Placeholder': ({ content, styles }) => <div style={{ ...styles, border: '1px dashed #ccc', width: '100%' }}>{content}</div>,
  'Footer': ({ content, styles }) => <footer style={{ ...styles, width: '100%' }}>{content}</footer>,
};

const StercsPageRenderer: React.FC<StercsPageRendererProps> = ({ slug, children }) => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/stercs-editor/pages/${slug}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (response.ok) {
          const data = await response.json();
          // We only render it dynamically if the database says it's published.
          if (data && data.page && data.page.is_published && data.page.content && data.page.content.blocks) {
            setPageData(data.page);
          } else {
            setPageData(null); // Fall back
          }
        } else {
          // Fall back on 404 or other errors
          setPageData(null);
        }
      } catch (err: any) {
        console.error('Network error fetching stercs page:', err);
        setPageData(null); // Always fallback to hardcoded React layout on error
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // If there's no published dynamic page for this slug, fallback to normal React code
  if (!pageData) {
    return <>{children}</>;
  }

  // Otherwise, render the dynamic blocks
  return (
    <div className="stercs-dynamic-page min-h-screen bg-gray-50 flex flex-col font-sans">
      {pageData.content.blocks.map((block: any, index: number) => {
        const Component = componentMap[block.type];
        if (!Component) {
          return <div key={index} className="text-red-500 p-2 border border-red-500 m-2">Unknown component type: {block.type}</div>;
        }

        return (
          <Component key={block.id || index} content={block.content} styles={block.styles || {}} />
        );
      })}
    </div>
  );
};

export default StercsPageRenderer;
