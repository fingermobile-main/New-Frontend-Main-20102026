import { useParams } from 'react-router-dom';
import React from 'react';

const PostDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Post Detail</h1>
      <p>This is the post detail page.</p>
    </div>
  );
};

export default PostDetailPage;