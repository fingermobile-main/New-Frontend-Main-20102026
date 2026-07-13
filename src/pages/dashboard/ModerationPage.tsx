import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { FlaggedContent } from '../../types';

const ModerationPage: React.FC = () => {
  const { flaggedContent, handleApproveContent, handleRemoveContent } =
    useAppContext();

  const FlaggedItemCard: React.FC<{ item: any }> = ({ item }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm">
            <span className="font-semibold">{item.post.author.name}</span>
            &apos;s post flagged for{" "}
            <span className="font-semibold text-red-600">{item.reason}</span>
          </p>
          <p className="text-xs text-gray-500">Flagged by: {item.flaggedBy}</p>
        </div>
        <p className="text-xs text-gray-400">{item.post.timestamp}</p>
      </div>
      <div className="my-3 p-3 bg-gray-50 rounded-md italic text-gray-700 text-sm">
        &quot;{item.contentPreview}&quot;
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => handleApproveContent?.(item.id)}
          className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full hover:bg-green-200"
        >
          Approve
        </button>
        <button
          onClick={() => handleRemoveContent?.(item.id)}
          className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full hover:bg-red-200"

        >
          Remove Content
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Moderation Queue</h1>
      {(flaggedContent || []).length > 0 ? (
        <div className="space-y-4">
          {(flaggedContent || []).map((item) => (
            <FlaggedItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
          <p className="font-semibold">The moderation queue is clear!</p>
          <p className="text-sm">No content has been flagged by members.</p>
        </div>
      )}
    </div>
  );
};
export default ModerationPage;
