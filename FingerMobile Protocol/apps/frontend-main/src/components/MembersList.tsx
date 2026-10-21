import React, { useState } from 'react';
import { Users, Search, Filter, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface Member {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  location?: string;
  isOnline: boolean;
  verified: boolean;
}

interface MembersListProps {
  members?: Member[];
  onSearch?: (query: string) => void;
  onMemberClick?: (memberId: string) => void;
  onInvite?: () => void;
}

const MembersList: React.FC<MembersListProps> = ({
  members: propMembers,
  onSearch,
  onMemberClick,
  onInvite
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const defaultMembers: Member[] = [
    {
      id: '1',
      username: 'john_doe',
      displayName: 'John Doe',
      location: 'New York, USA',
      isOnline: true,
      verified: true
    },
    {
      id: '2',
      username: 'jane_smith',
      displayName: 'Jane Smith',
      location: 'London, UK',
      isOnline: false,
      verified: true
    },
    {
      id: '3',
      username: 'bob_wilson',
      displayName: 'Bob Wilson',
      location: 'Toronto, Canada',
      isOnline: true,
      verified: false
    }
  ];

  const members = propMembers || defaultMembers;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold">
            <Users className="h-5 w-5 text-slate-700" />
            Members ({members.length})
          </CardTitle>
          <Button size="sm" onClick={onInvite}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="border-slate-300 text-slate-700">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onMemberClick?.(member.id)} role="button" tabIndex={0}
            >
              <div className="relative">
                <Avatar
                  src={member.avatar || undefined}
                  alt={member.displayName}
                  fallback={member.displayName.charAt(0)}
                />
                {member.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 truncate">{member.displayName}</p>
                  {member.verified && (
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-800 border border-slate-300">✓</Badge>
                  )}
                </div>
                <p className="text-sm text-slate-700 font-medium">@{member.username}</p>
                {member.location && (
                  <p className="text-xs text-slate-600 font-medium">{member.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersList;
