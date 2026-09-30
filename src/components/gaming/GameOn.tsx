import React, { useState } from 'react';
import { Gamepad2, Trophy, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface GameOnProps {
  userId?: string;
  onGameSelect?: (gameId: string) => void;
}

const GameOn: React.FC<GameOnProps> = ({ userId, onGameSelect }) => {
  const [activeTab, setActiveTab] = React.useState<'featured' | 'popular' | 'new'>('featured');

  const games = [
    {
      id: '1',
      title: 'Finger War Championship',
      description: 'Compete in the ultimate finger speed challenge',
      players: 1234,
      rating: 4.8,
      category: 'Action',
      image: '🎮',
      featured: true
    },
    {
      id: '2',
      title: 'Memory Matrix',
      description: 'Test your memory with pattern recognition',
      players: 856,
      rating: 4.5,
      category: 'Puzzle',
      image: '🧩',
      featured: true
    },
    {
      id: '3',
      title: 'Speed Typer',
      description: 'Race against time to type words correctly',
      players: 2341,
      rating: 4.7,
      category: 'Educational',
      image: '⌨️',
      featured: false
    },
    {
      id: '4',
      title: 'Reaction Master',
      description: 'Quick reflexes needed - can you beat the clock?',
      players: 1567,
      rating: 4.6,
      category: 'Action',
      image: '⚡',
      featured: false
    }
  ];

  const filteredGames = games.filter((game) => {
    if (activeTab === 'featured') return game.featured;
    if (activeTab === 'popular') return game.players > 1000;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-8 w-8" />
            GameOn
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and play exciting games
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Users className="h-4 w-4 mr-1" />
          {games.reduce((acc, g) => acc + g.players, 0).toLocaleString()} active players
        </Badge>
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'featured' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('featured')}
          className="rounded-none"
        >
          <Star className="h-4 w-4 mr-2" />
          Featured
        </Button>
        <Button
          variant={activeTab === 'popular' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('popular')}
          className="rounded-none"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Popular
        </Button>
        <Button
          variant={activeTab === 'new' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('new')}
          className="rounded-none"
        >
          <Zap className="h-4 w-4 mr-2" />
          New Releases
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="text-6xl text-center mb-2">{game.image}</div>
              <CardTitle className="text-xl">{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {game.players.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {game.rating}
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                {game.category}
              </Badge>
              <Button
                className="w-full"
                onClick={() => onGameSelect?.(game.id)}
              >
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameOn;
