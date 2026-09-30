import React, { useEffect, useState } from 'react';
import { blogService, BlogReadingList, BlogPost } from '../../services/blogService';

interface ReadingListViewProps {
  userId: string;
  listId?: string;
  onSelectPost?: (post: BlogPost) => void;
}

const progressColors = {
  unread: 'bg-gray-100 text-gray-800',
  reading: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
};

const progressIcons = {
  unread: '📖',
  reading: '✏️',
  completed: '✅'
};

const ReadingListView: React.FC<ReadingListViewProps> = ({
  userId,
  listId,
  onSelectPost
}) => {
  const [readingLists, setReadingLists] = useState<BlogReadingList[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(listId || null);
  const [listItems, setListItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReadingLists();
  }, [userId]);

  useEffect(() => {
    if (selectedList) {
      loadListItems(selectedList);
    }
  }, [selectedList]);

  const loadReadingLists = async () => {
    try {
      setLoading(true);
      const data = await blogService.getReadingLists();
      setReadingLists(data || []);

      // Auto-select first list if none selected
      if (!selectedList && data && data.length > 0) {
        setSelectedList(data[0].id);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load reading lists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadListItems = async (listId: string) => {
    try {
      const items = await blogService.getReadingListItems(listId);
      setListItems(items || []);
    } catch (err) {
      console.error('Failed to load list items:', err);
    }
  };

  const handleProgressChange = async (itemId: string, newProgress: string) => {
    try {
      await blogService.updateReadingListItem(itemId, { progress: newProgress });
      // Refresh items
      if (selectedList) {
        await loadListItems(selectedList);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await blogService.removeReadingListItem(itemId);
      // Refresh items
      if (selectedList) {
        await loadListItems(selectedList);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadReadingLists}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentList = readingLists.find(l => l.id === selectedList);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Reading List</h2>
        {currentList && (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
            {listItems.length} item{listItems.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* List Selector */}
      {readingLists.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {readingLists.map((list) => (
            <button
              key={list.id}
              onClick={() => setSelectedList(list.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedList === list.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {list.name}
              {list.is_default && (
                <span className="ml-2 text-xs opacity-75">(Default)</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Current List Info */}
      {currentList && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-1">{currentList.name}</h3>
          {currentList.description && (
            <p className="text-sm text-purple-700">{currentList.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-purple-600">
            <span>{listItems.length} items</span>
            <span>•</span>
            <span>
              {listItems.filter(i => i.progress === 'completed').length} completed
            </span>
            <span>•</span>
            <span>
              {listItems.filter(i => i.progress === 'reading').length} in progress
            </span>
          </div>
        </div>
      )}

      {/* Items List */}
      {listItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your reading list is empty</h3>
          <p className="text-gray-600 mb-4">Save articles to read them later</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Browse Articles
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {listItems.map((item) => {
            const post = item.post;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {post?.title || 'Untitled'}
                    </h4>
                    {post?.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                  >
                    🗑️
                  </button>
                </div>

                {/* Progress Selector */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Status:</span>
                  <select
                    value={item.progress}
                    onChange={(e) => handleProgressChange(item.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="unread">Unread</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                  </select>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    progressColors[item.progress as keyof typeof progressColors]
                  }`}>
                    {progressIcons[item.progress as keyof typeof progressIcons]}{' '}
                    {item.progress.charAt(0).toUpperCase() + item.progress.slice(1)}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>
                    Saved on {formatDate(item.created_at)}
                  </div>

                  {item.completed_at && (
                    <div>
                      Completed on {formatDate(item.completed_at)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {onSelectPost && post && (
                  <button
                    onClick={() => onSelectPost(post)}
                    className="mt-3 w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
                  >
                    Read Article →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReadingListView;
