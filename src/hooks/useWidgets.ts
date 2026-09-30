import { useState, useEffect } from 'react';

export const useWidgets = () => {
  const [widgets, setWidgets] = useState<{
    earnings: { fic: number; localCurrency: string; usd: string } | null;
    notifications: any[];
    events: any[];
    onlineFriends: any[];
  }>({
    earnings: null,
    notifications: [],
    events: [],
    onlineFriends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Adding simulated delay to ensure token might be set or just try to fetch
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Mock a token for development if one is not present and backend expects it
        // Or if the backend returns 401, we might need a test token
      }

      const res = await fetch('http://localhost:5001/api/dashboard/widgets', { headers });
      const data = await res.json();

      if (data.success) {
        setWidgets(data.data);
      } else {
        // Fallback data if server error or auth failure
        throw new Error(data.message || 'Failed to fetch widgets');
      }
    } catch (err: any) {
      setError(err.message);
      // Mock fallback data just to keep UI functional during development
      setWidgets({
        earnings: { fic: 1250.75, localCurrency: '₦485,291.50', usd: '$1,250.75' },
        notifications: [
          { id: 1, text: 'John liked your post', time: '2m ago' },
          { id: 2, text: 'New comment on your thread', time: '15m ago' },
          { id: 3, text: 'You earned 50 FIC', time: '1h ago' }
        ],
        events: [
          { id: 1, title: 'Community Meetup', date: 'Today, 6:00 PM', attendees: 45 },
          { id: 2, title: 'AI Workshop', date: 'Tomorrow, 2:00 PM', attendees: 128 },
          { id: 3, title: 'Creator Summit', date: 'Dec 20, 10:00 AM', attendees: 256 }
        ],
        onlineFriends: [
          { id: 1, name: 'Alice Smith', avatar: 'A', color: 'from-purple-300 to-pink-300' },
          { id: 2, name: 'Bob Johnson', avatar: 'B', color: 'from-blue-300 to-cyan-300' },
          { id: 3, name: 'Carol White', avatar: 'C', color: 'from-green-300 to-emerald-300' },
          { id: 4, name: 'David Brown', avatar: 'D', color: 'from-orange-300 to-red-300' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  return { widgets, loading, error, refreshWidgets: fetchWidgets };
};
