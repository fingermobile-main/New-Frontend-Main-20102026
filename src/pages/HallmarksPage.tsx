import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  TrophyIcon, 
  UsersIcon, 
  StarIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon
} from '@/icons';
import { useToast } from '@/hooks/use-toast';

const HallmarksPage: React.FC = () => {
  const { toast } = useToast();
  const [communities, setCommunities] = useState([
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
    }
  ]);

  const [myHallmarks, setMyHallmarks] = useState([
    {
      id: 1,
      name: 'Top Contributor',
      description: 'Awarded for consistently helpful contributions',
      awardedDate: '2023-08-12',
      icon: '🏆'
    },
    {
      id: 2,
      name: 'Community Builder',
      description: 'Recognized for creating valuable content',
      awardedDate: '2023-07-22',
      icon: '🏗️'
    },
    {
      id: 3,
      name: 'Helpful Hand',
      description: 'Awarded for helping others in the community',
      awardedDate: '2023-06-30',
      icon: '🤝'
    }
  ]);

  const handleJoinCommunity = (communityId: number) => {
    toast({
      title: "Community Joined",
      description: "You've successfully joined the community!"
    });
  };

  const handleCreateCommunity = () => {
    toast({
      title: "New Community",
      description: "Community creation form would open here."
    });
  };

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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="my-hallmarks">My Hallmarks</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Hallmark Communities</h2>
              <Button onClick={handleCreateCommunity}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{community.name}</h3>
                        {community.featured && (
                          <Badge className="mt-2 bg-yellow-500">Featured</Badge>
                        )}
                      </div>
                      <TrophyIcon className="w-8 h-8 text-yellow-300" />
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{community.description}</CardTitle>
                    <CardDescription className="pt-2">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        {community.members.toLocaleString()} members
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="w-4 h-4 mr-1" />
                        {community.badgesAwarded} badges awarded
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm text-gray-500 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Created {community.createdAt}
                    </div>
                    <Button onClick={() => handleJoinCommunity(community.id)}>
                      Join Community
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-hallmarks" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">My Hallmarks</h2>
            
            {myHallmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myHallmarks.map((hallmark) => (
                  <Card key={hallmark.id} className="text-center">
                    <CardHeader>
                      <div className="text-4xl mb-2">{hallmark.icon}</div>
                      <CardTitle className="text-xl">{hallmark.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{hallmark.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Awarded {hallmark.awardedDate}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hallmarks Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Participate in communities and contribute to earn your first hallmark!
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/hallmarks/communities">Explore Communities</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Hallmarks Leaderboard</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors This Month</CardTitle>
                <CardDescription>Members with the most hallmarks earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <div key={rank} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        rank === 1 ? 'bg-yellow-400 text-black' : 
                        rank === 2 ? 'bg-gray-300 text-black' : 
                        rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-200'
                      }`}>
                        {rank}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">User {rank}</h4>
                        <p className="text-sm text-gray-600">5 hallmarks earned</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <HeartIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ShareIcon className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HallmarksPage;