import React from 'react';
import PageHeader from '../components/PageHeader';
import useShowcaseData from '../hooks/useShowcaseData';

interface ShowcaseItemProps {
  item: {
    title: string;
    imageUrl: string;
    description?: string;
    prompt: string;
  };
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = ({ item }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden my-8 border">
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">{item.title}</h2>
        </div>
        <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-contain bg-gray-100 max-w-full h-auto" loading="lazy"  />
        <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <h3 className="font-semibold text-lg mb-2">Generation Prompt</h3>
            <pre className="bg-gray-800 text-gray-200 text-xs p-4 rounded-lg overflow-x-auto">
                <code>{item.prompt}</code>
            </pre>
        </div>
    </div>
);

const ShowcasePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Showcase</h1>
      <p>This is the showcase page.</p>
    </div>
  );
};

export default ShowcasePage;
