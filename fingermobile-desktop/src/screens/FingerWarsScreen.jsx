import React, { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../../services/ApiService';
import { electronAPI } from '../../preload';
import './FingerWarsScreen.css';

/**
 * FingerWars Screen - Gaming Platform
 */
const FingerWarsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await ApiService.checkConnectivity();
      setIsOffline(!isConnected);

      const [gamesResult, sessionsResult] = await Promise.all([
        ApiService.getGames({ useCache: true }),
        ApiService.getGameSessions({ useCache: true })
      ]);

      if (gamesResult.success) setGames(gamesResult.data || []);
      if (sessionsResult.success) setSessions(sessionsResult.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayGame = async (game) => {
    setSelectedGame(game);
    setIsPlaying(true);

    try {
      const result = await ApiService.createGameSession({
        gameId: game.id,
        mode: 'single',
        betAmount: game.min_bet || 0
      });

      if (result.success) {
        if (electronAPI?.showNotification) {
          electronAPI.showNotification({
            title: '🎮 Game Started!',
            body: `Good luck in ${game.name}!`
          });
        }
        await loadData();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmitScore = async (sessionId, score) => {
    try {
      await ApiService.submitLeaderboardScore({
        sessionId,
        score,
        metadata: { timestamp: new Date().toISOString() }
      });
      if (electronAPI?.showNotification) {
        electronAPI.showNotification({
          title: '🏆 Score Submitted!',
          body: 'Your score has been recorded!'
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="fingerwars-screen loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fingerwars-screen">
      {isOffline && (
        <div className="offline-banner">
          <span>📴</span>
          <span>You are offline. Game features may be limited.</span>
        </div>
      )}

      <div className="fingerwars-header">
        <h1>🎮 FingerWars</h1>
        <button onClick={loadData} className="refresh-button">🔄</button>
      </div>

      <div className="tabs-container">
        <button
          className={`tab ${selectedTab === 'games' ? 'active' : ''}`}
          onClick={() => setSelectedTab('games')}
        >
          Games
        </button>
        <button
          className={`tab ${selectedTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('sessions')}
        >
          My Sessions
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === 'games' ? (
          <div className="games-grid">
            {games.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎮</div>
                <h3>No Games Available</h3>
                <p>Check back later for new games</p>
              </div>
            ) : (
              games.map((game) => (
                <div key={game.id} className="game-card">
                  <div className="game-image">
                    {game.thumbnail_url ? (
                      <img src={game.thumbnail_url} alt={game.name} />
                    ) : (
                      <div className="game-placeholder">🎮</div>
                    )}
                  </div>
                  <div className="game-details">
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                    <div className="game-meta">
                      <span className="game-bet">
                        💰 {game.min_bet} - {game.max_bet} FIC
                      </span>
                      <span className="game-rtp">
                        📊 RTP: {game.rtp_percentage}%
                      </span>
                    </div>
                    <button
                      onClick={() => handlePlayGame(game)}
                      className="play-button"
                      disabled={isPlaying}
                    >
                      {isPlaying ? 'Starting...' : 'Play Now'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎮</div>
                <h3>No Active Sessions</h3>
                <p>Start playing to see your sessions</p>
                <button onClick={() => setSelectedTab('games')} className="action-button">
                  Browse Games
                </button>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <h4>{session.game_name}</h4>
                    <span className={`status-badge status-${session.status}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="session-details">
                    <div className="detail-row">
                      <span>Mode:</span>
                      <strong>{session.mode}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Bet:</span>
                      <strong>{session.bet_amount} FIC</strong>
                    </div>
                    <div className="detail-row">
                      <span>Winnings:</span>
                      <strong className={session.winnings > 0 ? 'win' : ''}>
                        {session.winnings} FIC
                      </strong>
                    </div>
                  </div>
                  {session.status === 'active' && (
                    <div className="session-actions">
                      <button
                        onClick={() => handleSubmitScore(session.id, Math.floor(Math.random() * 10000))}
                        className="submit-score-button"
                      >
                        Submit Score
                      </button>
                      <button className="end-session-button">
                        End Session
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="error-toast">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="toast-close">✕</button>
        </div>
      )}
    </div>
  );
};

export default FingerWarsScreen;
