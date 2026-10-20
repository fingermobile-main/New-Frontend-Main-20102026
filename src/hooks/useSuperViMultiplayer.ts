import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppContext } from '../contexts/AppContext';

interface UseSuperViMultiplayerProps {
  memberId?: string;
}

export interface Player {
  id: string;
  membername: string;
  score: number;
  level: number;
  avatar: string;
  characterId?: string;
  isCurrentMember: boolean;
  isConnected: boolean;
}

interface ActionPayloads {
  move_made: { lane: number; positionZ: number };
  combo_achieved: { playerName: string; comboType: string };
  stun_performed: { playerName: string };
  powerup_used: { playerName: string; powerUpType: string };
  chat_message: { senderName: string; message: string };
  [key: string]: unknown;
}

interface UseSuperViMultiplayerReturn {
  players: Player[];
  currentPlayerRank: number;
  setCurrentPlayerRank: (rank: number) => void;
  gameRoomId?: string;
  isGameRoomActive: boolean;
  isWaitingForPlayers: boolean;
  maxPlayers: number;
  currentPlayers: number;
  joinGameRoom: (roomId: string, maxPlayers: number, characterId?: string) => Promise<void>;
  leaveGameRoom: () => Promise<void>;
  sendPlayerAction: <K extends keyof ActionPayloads>(action: K, data: ActionPayloads[K]) => void;
  updatePlayerScore: (newScore: number) => void;
  initializeMultiplayer: () => void;
}

export const useSuperViMultiplayer = ({ memberId }: UseSuperViMultiplayerProps): UseSuperViMultiplayerReturn => {
  const { showToast } = useAppContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState<number>(0);
  const [gameRoomId, setGameRoomId] = useState<string | undefined>(undefined);
  const [isGameRoomActive, setIsGameRoomActive] = useState<boolean>(false);
  const [isWaitingForPlayers, setIsWaitingForPlayers] = useState<boolean>(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [currentPlayers, setCurrentPlayers] = useState<number>(1);

  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize socket connection
  const initializeMultiplayer = useCallback(() => {
    if (socketRef.current) return;

    try {
      const socketUrl = process.env.REACT_APP_WS_URL || window.location.origin;
      const socket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('token') || '',
          isGuest: !localStorage.getItem('token'),
          game: 'supervi'
        },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3
      });

      socket.on('connect', () => {
        // Connected
      });

      socket.on('supervi:player_joined', (data: { playerId: string; playerName: string; characterId: string }) => {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === data.playerId)) return prev;
          return [
            ...prev,
            {
              id: data.playerId,
              membername: data.playerName,
              score: 0,
              level: 1,
              avatar: '👤',
              characterId: data.characterId,
              isCurrentMember: data.playerId === memberId,
              isConnected: true
            }
          ];
        });
        showToast(`${data.playerName} joined the run!`, 'info');
      });

      socket.on('supervi:player_left', (data: { playerId: string }) => {
        setPlayers((prev) => prev.filter((p) => p.id !== data.playerId));
      });

      socket.on('supervi:state_synced', (data: { playerId: string; score: number }) => {
        setPlayers((prev) =>
          prev.map((p) => (p.id === data.playerId ? { ...p, score: data.score } : p))
        );
      });

      socketRef.current = socket;
    } catch (_) {
      // Local simulation fallback if WebSocket unavailable
    }
  }, [memberId, showToast]);

  // Join a game room
  const joinGameRoom = useCallback(
    async (roomId: string, maxPlayersCount: number, characterId?: string) => {
      try {
        setGameRoomId(roomId);
        setMaxPlayers(maxPlayersCount);
        setIsGameRoomActive(true);
        setIsWaitingForPlayers(true);

        const currentPlayer: Player = {
          id: memberId || 'me',
          membername: 'You',
          score: 0,
          level: 1,
          avatar: '👤',
          characterId: characterId || 'zara_zephyr',
          isCurrentMember: true,
          isConnected: true
        };

        setPlayers([currentPlayer]);

        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('supervi:join_room', {
            roomId,
            characterId,
            playerName: 'You'
          });
        }
        showToast(`Joined Arena Lobby: Room ${roomId}`, 'success');
      } catch {
        showToast('Failed to join game room', 'error');
      }
    },
    [memberId, showToast]
  );

  // Leave room
  const leaveGameRoom = useCallback(async () => {
    try {
      if (socketRef.current && socketRef.current.connected && gameRoomId) {
        socketRef.current.emit('supervi:leave_room', { roomId: gameRoomId });
      }
      setIsGameRoomActive(false);
      setIsWaitingForPlayers(false);
      setPlayers([]);
      setGameRoomId(undefined);
      setCurrentPlayers(0);
    } catch (_) {
      // Fallback
    }
  }, [gameRoomId]);

  // Send player action (move, combo, stun)
  const sendPlayerAction = useCallback(
    <K extends keyof ActionPayloads>(action: K, data: ActionPayloads[K]) => {
      if (socketRef.current && socketRef.current.connected && gameRoomId) {
        socketRef.current.emit('supervi:player_action', {
          roomId: gameRoomId,
          action,
          payload: data
        });
      }

      switch (action) {
        case 'combo_achieved': {
          const payload = data as ActionPayloads['combo_achieved'];
          showToast(`${payload.playerName} achieved a ${payload.comboType} combo!`, 'info');
          break;
        }
        case 'stun_performed': {
          const payload = data as ActionPayloads['stun_performed'];
          showToast(`${payload.playerName} unleashed a Stun!`, 'info');
          break;
        }
        case 'powerup_used': {
          const payload = data as ActionPayloads['powerup_used'];
          showToast(`${payload.playerName} activated ${payload.powerUpType}!`, 'info');
          break;
        }
        default:
          break;
      }
    },
    [gameRoomId, showToast]
  );

  // Update local player score & sync to room
  const updatePlayerScore = useCallback(
    (newScore: number) => {
      if (!memberId) return;

      setPlayers((prev) =>
        prev.map((player) =>
          player.isCurrentMember ? { ...player, score: newScore } : player
        )
      );

      if (socketRef.current && socketRef.current.connected && gameRoomId) {
        socketRef.current.emit('supervi:sync_state', {
          roomId: gameRoomId,
          score: newScore
        });
      }
    },
    [memberId, gameRoomId]
  );

  // Simulate other players joining if room active and waiting (AI Ghost Runners)
  useEffect(() => {
    if (isGameRoomActive && isWaitingForPlayers && players.length < maxPlayers) {
      const simulatePlayerJoin = () => {
        if (players.length < maxPlayers) {
          const ghostNames = ['ZaraRunner_99', 'KanoSpeeder', 'LagosPhantom', 'SahelChieftain'];
          const randomName = ghostNames[players.length % ghostNames.length];
          const newPlayer: Player = {
            id: `ghost_${players.length + 1}`,
            membername: randomName,
            score: Math.floor(Math.random() * 200),
            level: 1,
            avatar: '👤',
            isCurrentMember: false,
            isConnected: true
          };

          setPlayers((prev) => [...prev, newPlayer]);
          setCurrentPlayers((prev) => prev + 1);

          if (players.length + 1 >= maxPlayers) {
            setIsWaitingForPlayers(false);
            showToast('Multiplayer room full! Ready for launch.', 'success');
          }
        }
      };

      timerRef.current = setTimeout(simulatePlayerJoin, 2500);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isGameRoomActive, isWaitingForPlayers, maxPlayers, players.length, showToast]);

  return {
    players,
    currentPlayerRank,
    setCurrentPlayerRank,
    gameRoomId,
    isGameRoomActive,
    isWaitingForPlayers,
    maxPlayers,
    currentPlayers,
    joinGameRoom,
    leaveGameRoom,
    sendPlayerAction,
    updatePlayerScore,
    initializeMultiplayer
  };
};

export default useSuperViMultiplayer;
