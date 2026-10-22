import React from 'react';
import { Users, UserPlus, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Link } from 'react-router-dom';

interface Member {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  profession?: string;
  mutualConnections?: number;
  isFollowing?: boolean;
}

interface DiscoveredMembersProps {
  members?: Member[];
  onFollow?: (memberId: string) => void;
  onViewProfile?: (memberId: string) => void;
}

const DiscoveredMembers: React.FC<DiscoveredMembersProps> = ({
  members: propMembers,
  onFollow,
  onViewProfile
}) => {
  const defaultMembers: Member[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      location: 'New York, USA',
      profession: 'Product Designer',
      mutualConnections: 12,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      location: 'San Francisco, USA',
      profession: 'Software Engineer',
      mutualConnections: 8,
      isFollowing: true
    },
    {
      id: '3',
      name: 'Emma Williams',
      location: 'London, UK',
      profession: 'Marketing Director',
      mutualConnections: 15,
      isFollowing: false
    },
    {
      id: '4',
      name: 'James Brown',
      location: 'Toronto, Canada',
      profession: 'Data Scientist',
      mutualConnections: 6,
      isFollowing: false
    }
  ];

  const members = propMembers || defaultMembers;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
          <Users className="h-5 w-5 text-slate-700" />
          Discover Members
        </h2>
        <Button variant="ghost" size="sm" asChild className="text-slate-700 font-semibold hover:text-slate-900">
          <Link to="/members">View All</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <Card key={member.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onViewProfile?.(member.id)}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  aria-label={`View ${member.name}'s profile`}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    fallback={member.name.charAt(0)}
                    className="h-12 w-12 cursor-pointer"
                    size="lg"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-slate-900 hover:underline cursor-pointer truncate"
                    onClick={() => onViewProfile?.(member.id)}
                  >
                    {member.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-slate-700 font-medium">
                    {member.profession && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-slate-500" />
                        <span className="truncate">{member.profession}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span>{member.location}</span>
                      </div>
                    )}
                  </div>
                  {member.mutualConnections && member.mutualConnections > 0 && (
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {member.mutualConnections} mutual connections
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={member.isFollowing ? 'outline' : 'default'}
                  className={member.isFollowing ? 'border-slate-300 text-slate-800 font-semibold' : ''}
                  onClick={() => onFollow?.(member.id)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {member.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscoveredMembers;
