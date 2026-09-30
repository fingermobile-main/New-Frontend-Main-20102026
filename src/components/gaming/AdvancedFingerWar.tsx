import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Users, Timer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface AdvancedFingerWarProps {
  gameId?: string;
  playerName?: string;
  onJoinGame?: (gameId: string) => void;
  onLeaveGame?: () => void;
}

const AdvancedFingerWar: React.FC<AdvancedFingerWarProps> = ({
  gameId,
  playerName,
  onJoinGame,
  onLeaveGame
}) => {
  const [gameState, setGameState] = React.useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [score, setScore] = React.useState(0);
  const [timeRemaining, setTimeRemaining] = React.useState(60);
  const [players, setPlayers] = React.useState([
    { id: '1', name: 'Player 1', score: 0 },
    { id: '2', name: 'Player 2', score: 0 }
  ]);

  React.useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      setGameState('finished');
    }
  }, [gameState, timeRemaining]);

  const handleStartGame = () => {
    setGameState('playing');
    setTimeRemaining(60);
    setScore(0);
  };

  const handleFingerTap = () => {
    if (gameState === 'playing') {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Advanced Finger War
          </CardTitle>
          <CardDescription>
            Test your finger speed and reflexes in this competitive game!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {gameState === 'lobby' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{players.length} players</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>Competitive mode</span>
                </div>
              </div>
              <Button onClick={handleStartGame} size="lg" className="w-full">
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span className="text-lg font-bold">{timeRemaining}s</span>
                </div>
                <div className="text-3xl font-bold">{score}</div>
              </div>

              <div
                className="h-64 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                onClick={handleFingerTap} role="button" tabIndex={0}
              >
                <div className="text-center">
                  <Gamepad2 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-semibold">Tap Here!</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Leaderboard</h3>
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>{player.name}</span>
                    <span className="font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center space-y-4">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold">Game Over!</h3>
                <p className="text-muted-foreground">Your final score: {score}</p>
              </div>
              <Button onClick={() => setGameState('lobby')} size="lg">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFingerWar;
