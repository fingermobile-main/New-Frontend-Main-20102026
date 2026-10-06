import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface GroupPreview {
  id: string;
  name: string;
  unread: number;
}

const GroupsWidget: React.FC = () => {
  const [groups, setGroups] = useState<GroupPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/groups/sidebar');
        setGroups(response.data);
      } catch (e) {
        setGroups([
          { id: '1', name: 'Good Group', unread: 3 },
          { id: '2', name: 'E-course Group', unread: 0 },
          { id: '3', name: 'Tech Enthusiasts', unread: 12 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Groups</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center py-2">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => navigate(`/group/${group.id}`)}
              className="flex items-center justify-between py-2 w-full text-left group cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg px-1.5 transition"
            >
              <div>
                <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{group.name}</div>
                <div className="text-sm text-orange-500 font-medium">View feed →</div>
              </div>
              {group.unread > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow">
                  {group.unread > 99 ? '99+' : group.unread}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupsWidget;
