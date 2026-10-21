import React, { useState } from 'react';
import { Music, Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BeatwaveHeaderProps {
  onSearch?: (query: string) => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  notificationCount?: number;
}

const BeatwaveHeader: React.FC<BeatwaveHeaderProps> = ({
  onSearch,
  onNotifications,
  onProfile,
  notificationCount = 0
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-slate-900">Beatwave</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <Input
                type="search"
                placeholder="Search tracks, artists, playlists..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 text-slate-900 font-medium border-slate-300"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onNotifications} className="text-slate-700 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notificationCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onProfile} className="text-slate-700 hover:text-slate-900">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BeatwaveHeader;
