import { useNavigate, useParams} from 'react-router-dom';
import React from 'react';

const EditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">Editor Page</h1>
      <p>This is the editor page.</p>
    </div>
  );
};

export default EditorPage;
