import React, { useState } from 'react';
interface FollowSuggestionsProps {
  currentUserId?: string;
  onFollow?: (userId: string) => void;
  maxSuggestions?: number;
}

const FollowSuggestions: React.FC<FollowSuggestionsProps> = ({
  currentUserId,
  onFollow,
  maxSuggestions = 5
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([
    { id: 'user1', name: 'Sarah Johnson', username: '@sarahj', avatar: null, followers: 1234, mutualFriends: 5 },
    { id: 'user2', name: 'Mike Chen', username: '@mikechen', avatar: null, followers: 892, mutualFriends: 3 },
    { id: 'user3', name: 'Emma Davis', username: '@emmad', avatar: null, followers: 2456, mutualFriends: 8 },
    { id: 'user4', name: 'Alex Kim', username: '@alexk', avatar: null, followers: 567, mutualFriends: 2 },
    { id: 'user5', name: 'Lisa Wang', username: '@lisaw', avatar: null, followers: 3421, mutualFriends: 12 }
  ]);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    setFollowing(prev => new Set(prev).add(userId));
    if (onFollow) {
      onFollow(userId);
    }
  };

  const handleUnfollow = (userId: string) => {
    setFollowing(prev => {
      const updated = new Set(prev);
      updated.delete(userId);
      return updated;
    });
  };

  const toggleFollow = (userId: string) => {
    if (following.has(userId)) {
      handleUnfollow(userId);
    } else {
      handleFollow(userId);
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          👥 Who to Follow
        </h3>
      </div>

      {/* Suggestions List */}
      <div className="divide-y divide-gray-100">
        {suggestions.slice(0, maxSuggestions).map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user.name.charAt(0)}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{user.name}</h4>
                <p className="text-sm text-gray-600 truncate">{user.username}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-700">
                  <span>{user.followers.toLocaleString()} followers</span>
                  {user.mutualFriends > 0 && (
                    <>
                      <span>•</span>
                      <span>{user.mutualFriends} mutual friends</span>
                    </>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => toggleFollow(user.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  following.has(user.id)
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {following.has(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-300 px-4 py-3 bg-gray-50">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          See all suggestions →
        </button>
      </div>
    </div>
  );
};

export default FollowSuggestions;
