import React, { useState, useEffect } from 'react';

interface MarkdownViewerProps {
  /** Path to the markdown file relative to the public directory */
  filePath: string;
  className?: string;
}

/**
 * A component to fetch and display the content of a Markdown file.
 * Expects the file to be available in the public directory.
 */
const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ filePath, className = '' }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        // Use PUBLIC_URL if the file is under a subdirectory served by the public folder
        // const response = await fetch(`${process.env.PUBLIC_URL}/${filePath}`);
        // For files directly under public/, fetch relative to the root
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching markdown:', err);
        setError((err as Error).message || 'Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Basic conversion of markdown-like syntax to HTML elements.
  // This is a simplified version. A library like marked or react-markdown would be better for complex MD.
  const renderMarkdown = (mdText: string) => {
    const paragraphs = mdText.split(/\n\s*\n/); // Split by double newlines for paragraphs

    return paragraphs.map((paragraph, index) => {
      paragraph = paragraph.trim();
      if (paragraph.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4">{paragraph.substring(2)}</h1>;
      } else if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3">{paragraph.substring(3)}</h2>;
      } else if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2">{paragraph.substring(4)}</h3>;
      } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        const listItems = paragraph.split('\n').filter(li => li.trim().startsWith('- ') || li.trim().startsWith('* '));
        return <ul key={index} className="list-disc pl-5 mb-2">{listItems.map((item, itemIndex) => <li key={itemIndex}>{item.substring(2).trim()}</li>)}</ul>;
      } else {
        // Simple inline replacement for **bold** and *italic*
        let processedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedParagraph = processedParagraph.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle links [text](url)
        processedParagraph = processedParagraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-blue-500 underline">$1</a>');

        // Return as HTML
        return <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: processedParagraph }} />;
      }
    });
  };


  return (
    <div className={`prose max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownViewer;
