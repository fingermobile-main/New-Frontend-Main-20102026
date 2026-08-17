import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { Post, Member } from '../types';

interface DashboardData {recentActivity: Post[];
  newMembers: Member[];
  totalMembers: number;
  activePosts: number;
  totalRevenue: number;
  communitySections?: any[];
  featuredSections?: any[];
  quickActions?: any[];
  ficBalance?: number;
}

interface UseDashboardDataResult {data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const useDashboardData = (): UseDashboardDataResult => {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock dashboard data since backend endpoints don't exist yet
      const mockRecentActivity: Post[] = [
        {id: '1', title: 'Welcome to FingerMobile', content: 'Explore our platform features',
  author: { id: 'user1', name: 'Admin' },
createdAt: new Date().toISOString(),
timestamp: new Date().toISOString(),
likes: 42,
comments: 5
        }, {id: '2', title: 'New Features Released', content: 'Check out the latest updates',
  author: { id: 'user2', name: 'Team' },
createdAt: new Date(Date.now() - 86400000).toISOString(),
timestamp: new Date(Date.now() - 86400000).toISOString(),
likes: 28,
comments: 3
        }, {id: '3', title: 'Community Guidelines', content: 'Please review our community standards',
  author: { id: 'user3', name: 'Moderator' },
createdAt: new Date(Date.now() - 172800000).toISOString(),
timestamp: new Date(Date.now() - 172800000).toISOString(),
likes: 15,
comments: 2
        }
      ];

      // Create mock members with the required permissions property
      const mockMembers = [
        {
          id: 'member1', 
          name: 'John Doe', 
          username: 'JohnDoe', 
          email: 'john@example.com',
          joinedAt: new Date().toISOString(), 
          role: 'user',
          permissions: [] // Adding the missing permissions property
        }, 
        {
          id: 'member2', 
          name: 'Jane Smith', 
          username: 'JaneSmith', 
          email: 'jane@example.com',
          joinedAt: new Date().toISOString(), 
          role: 'user',
          permissions: [] // Adding the missing permissions property
        }, 
        {
          id: 'member3', 
          name: 'Bob Johnson', 
          username: 'BobJ', 
          email: 'bob@example.com',
          joinedAt: new Date().toISOString(), 
          role: 'moderator',
          permissions: [] // Adding the missing permissions property
        }
      ];

      setData({recentActivity: mockRecentActivity,
  newMembers: mockMembers,
  totalMembers: 1250,
  activePosts: 342,
  totalRevenue: 1250000,
  ficBalance: 5000
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = React.useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refreshData };
};

export default useDashboardData;
