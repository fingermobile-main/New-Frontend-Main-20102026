/*
 * FingerMobile Protocol™ - Hallmarks Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  TrophyIcon,
  UsersIcon,
  // eslint-disable-next-line no-unused-vars
  StarIcon,
  CalendarIcon,
  // eslint-disable-next-line no-unused-vars
  ClockIcon,
  PlusIcon,
  EyeIcon,
  // eslint-disable-next-line no-unused-vars
  HeartIcon,
  // eslint-disable-next-line no-unused-vars
  ShareIcon
} from '../icons';
import { hallmarksService, Hallmark } from '../services/HallmarksService';
import { useAppContext } from '../contexts/AppContext';

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  badgesAwarded: number;
  createdAt: string;
  featured: boolean;
}

const HallmarksPage: React.FC = () => {
  const { user } = useAppContext(); // Get current user from context
  // eslint-disable-next-line no-unused-vars
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: 'Tech Innovators',
      description: 'For tech enthusiasts and innovators to share ideas and projects',
      members: 1242,
      badgesAwarded: 42,
      createdAt: '2023-05-15',
      featured: true
    },
    {
      id: 2,
      name: 'Art & Design',
      description: 'Creative minds sharing artistic works and design inspiration',
      members: 892,
      badgesAwarded: 28,
      createdAt: '2023-06-22',
      featured: false
    },
    {
      id: 3,
      name: 'Fitness Warriors',
      description: 'Motivation and tips for fitness enthusiasts',
      members: 2105,
      badgesAwarded: 67,
      createdAt: '2023-04-10',
      featured: true
    },
    {
      id: 4,
      name: 'Book Club',
      description: 'Literature lovers discussing books and authors',
      members: 542,
      badgesAwarded: 15,
      createdAt: '2023-07-01',
      featured: false
    },
    {
      id: 5,
      name: 'Entrepreneurs Hub',
      description: 'Networking and sharing business insights',
      members: 784,
      badgesAwarded: 35,
      createdAt: '2023-03-18',
      featured: true
    },
    {
      id: 6,
      name: 'Gaming Community',
      description: 'For gamers to connect and share experiences',
      members: 1563,
      badgesAwarded: 89,
      createdAt: '2023-08-05',
      featured: false
    },
    {
      id: 7,
      name: 'Travel Enthusiasts',
      description: 'Sharing travel stories and recommendations',
      members: 923,
      badgesAwarded: 52,
      createdAt: '2023-09-12',
      featured: true
    },
    {
      id: 8,
      name: 'Food Lovers',
      description: 'Recipes, cooking tips, and food reviews',
      members: 1342,
      badgesAwarded: 76,
      createdAt: '2023-02-28',
      featured: false
    }
  ]);

  const [myHallmarks, setMyHallmarks] = useState<Hallmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Infinite scroll state for communities tab
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [communityItems, setCommunityItems] = useState<Community[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Hallmark Community Commentary & Milestone Commendations
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; time: string }>>([
    { id: '1', author: 'Nia Adebayo', text: 'Huge congratulations to all sovereign node builders awarded the Top Contributor Hallmark!', time: '10m ago' },
    { id: '2', author: 'Tariq Al-Mansoor', text: 'Proud to see our Digital Living Room community achieve the Community Builder Hallmark milestone today!', time: '25m ago' }
  ]);

  const handlePostCommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: user?.username || 'You',
      text: commentInput.trim(),
      time: 'Just now'
    };
    setComments(prev => [newComment, ...prev]);
    voiceLineServiceInstance.playCommentaryVoiceLine('hallmarks');
    setCommentInput('');
  };

  // Fetch user hallmarks from backend
  useEffect(() => {
    const fetchUserHallmarks = async () => {
      if (!user?.id) {
        // If user is not authenticated, use mock data
        setMyHallmarks([
          {
            id: 1,
            name: 'Top Contributor',
            description: 'Awarded for consistently helpful contributions',
            rarity: 'rare',
            category: 'achievement',
            criteria: {},
            createdAt: '2023-08-12',
            updatedAt: '2023-08-12',
            icon: '🏆'
          },
          {
            id: 2,
            name: 'Community Builder',
            description: 'Recognized for creating valuable content',
            rarity: 'epic',
            category: 'community',
            criteria: {},
            createdAt: '2023-07-22',
            updatedAt: '2023-07-22',
            icon: '🏗️'
          },
          {
            id: 3,
            name: 'Helpful Hand',
            description: 'Awarded for helping others in the community',
            rarity: 'common',
            category: 'achievement',
            criteria: {},
            createdAt: '2023-06-30',
            updatedAt: '2023-06-30',
            icon: '🤝'
          },
          {
            id: 4,
            name: 'Rising Star',
            description: 'For new members making quick impact',
            rarity: 'uncommon',
            category: 'milestone',
            criteria: {},
            createdAt: '2023-09-05',
            updatedAt: '2023-09-05',
            icon: '⭐'
          },
          {
            id: 5,
            name: 'Knowledge Keeper',
            description: 'Expert in sharing educational content',
            rarity: 'rare',
            category: 'achievement',
            criteria: {},
            createdAt: '2023-05-18',
            updatedAt: '2023-05-18',
            icon: '📚'
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await hallmarksService.getUserHallmarks(user.id);

        if (response.success) {
          setMyHallmarks(response.data.map(uh => uh.hallmark));
        } else {
          setError('Failed to load your hallmarks');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user hallmarks:', err);
        setError('Failed to load your hallmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchUserHallmarks();
  }, [user]);

  // Check if user is logged in (implement your own logic)
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if user is logged in by checking localStorage, cookies, or auth tokens
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      setIsLoggedIn(!!token || !!userData);
    };

    checkLoginStatus();

    // Listen for auth changes
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulate loading more communities for infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoggedIn || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would fetch more communities from the API
    // For now, we'll create some mock communities to simulate more content
    const newItems: Community[] = Array.from({ length: 3 }, (_, i) => ({
      id: communities.length + communityItems.length + i + 1,
      name: `Additional Community ${page}.${i + 1}`,
      description: `Description for additional community ${page}.${i + 1}`,
      members: Math.floor(Math.random() * 5000) + 100,
      badgesAwarded: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      featured: Math.random() > 0.5
    }));

    setCommunityItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);

    // Stop loading more if we've reached a certain threshold or user has logged in
    if (page >= 10) { // Increased limit
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isLoggedIn, page, communities.length, communityItems.length]);

  // Handle infinite scroll with Intersection Observer
  useEffect(() => {
    if (isLoggedIn) {
      // Stop infinite scroll when user logs in
      setHasMore(false);
      return;
    }

    if (sentinelRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreItems();
          }
        },
        { threshold: 1.0 }
      );

      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, isLoggedIn]);

  // Initialize community items with initial communities when not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setCommunityItems(communities);
    }
  }, [communities, isLoggedIn]);

  const handleJoinCommunity = (communityId: number) => {
    alert(`Community ${communityId} joined!`);
  };

  const handleCreateCommunity = () => {
    alert('Community creation form would open here.');
  };

  // Combine initial and infinite scroll items
  const allCommunities = [...communities, ...communityItems].filter((community, index, self) =>
    index === self.findIndex(c => c.id === community.id) // Remove duplicates
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hallmarks</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover recognition systems, join communities, and earn achievements
          </p>
        </div>

        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md rounded-lg p-1 mb-8">
            <TabsTrigger value="communities" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              Communities
            </TabsTrigger>
            <TabsTrigger value="hallmarks" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              Hallmarks
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 rounded-md py-2">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Your Communities</h2>
              <Button onClick={handleCreateCommunity} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCommunities.map((community) => (
                <Card key={community.id} className="overflow-hidden bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-800">{community.name}</CardTitle>
                      {community.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600">{community.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      <span>{community.members.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      <span>{community.badgesAwarded} badges awarded</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button onClick={() => handleJoinCommunity(community.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      Join
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} style={{ height: '20px' }} />

            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {!hasMore && allCommunities.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                You've reached the end of the communities list.
              </div>
            )}

            {allCommunities.length === 0 && !isLoadingMore && (
              <div className="text-center py-8 text-gray-500">
                No communities found.
              </div>
            )}
          </TabsContent>

          <TabsContent value="hallmarks" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Hallmarks</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHallmarks.map((hallmark) => (
                <Card key={hallmark.id} className="overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md rounded-xl border border-indigo-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{hallmark.icon || '🏅'}</div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">{hallmark.name}</CardTitle>
                        <CardDescription className="text-gray-600">{hallmark.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>Awarded {new Date(hallmark.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="mr-2">
                        {hallmark.category}
                      </Badge>
                      <Badge variant="outline">
                        {hallmark.rarity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl">Earn More Hallmarks</CardTitle>
                <CardDescription className="text-indigo-100">
                  Participate in communities and contribute to earn recognition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Hallmarks are special recognitions given to community members for their contributions and achievements.
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">Learn More</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Discover Communities</h2>
            <p className="text-gray-600">
              Explore communities that match your interests and connect with like-minded individuals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCommunities.slice(0, 6).map((community) => (
                <Card key={`discover-${community.id}`} className="overflow-hidden bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-800">{community.name}</CardTitle>
                      {community.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600">{community.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      <span>{community.members.toLocaleString()} members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      <span>{community.badgesAwarded} badges awarded</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleJoinCommunity(community.id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      Join Community
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Hallmark Community Commentary & Commendations */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>🏅</span> Hallmark Commendations & Discourse
              </h3>
              <p className="text-sm text-gray-500">
                Congratulate peers on milestone unlocks and share community hallmark accolades.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {comments.length} Commendations
            </span>
          </div>

          <form onSubmit={handlePostCommendation} className="flex gap-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Leave an encouraging comment or commendation on this hallmark..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 rounded-xl">
              Post Comment
            </Button>
          </form>

          <div className="space-y-3 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between">
                <div>
                  <span className="font-bold text-sm text-gray-800 mr-2">@{c.author}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                  <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallmarksPage;
