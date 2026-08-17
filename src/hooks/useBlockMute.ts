import React, { useState } from 'react';
import { blockMuteService, MuteData } from '../services/blockMuteService';

interface BlockData {
  blockedUserId: string;
  reason?: string;
  duration?: string;
}

interface BlockStatusResponse {
  isBlocked: boolean;
  isMuted: boolean;
}

const useBlockMute = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedMutedUsers, setBlockedMutedUsers] = useState<any[]>([]);

  // Fetch blocked/muted users
  const fetchBlockedMutedUsers = async (muteType?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Pass page and limit as separate parameters
      const response = await blockMuteService.getBlocks({
  page: 1,
  limit: 50,
  ...(muteType ? {
  type: muteType
  } : {}) // Change parameter name if needed
      });
      // Combine both blocks and mutes into one array
      setBlockedMutedUsers([...response.blocks, ...response.mutes]);
    } catch (err: any) {
      setError("Failed to fetch blocked/muted users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Block a user
  const blockUser = async (
  blockData: Omit<BlockData, 'blockedUserId'> & {userId: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Map userId to blockedUserId
      const mappedBlockData: BlockData = {
  blockedUserId: blockData.userId,
  reason: blockData.reason,
  duration: blockData.duration
      };
      
      await blockMuteService.blockUser(mappedBlockData);
      
      // Refresh the list after blocking
      await fetchBlockedMutedUsers();
    } catch (err: any) {
      setError("Failed to block user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mute notifications
  const muteNotifications = async (
  muteData: {mutedUserId: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Create proper MuteData object
      const mappedMuteData: MuteData = {
  mutedUserId: muteData.mutedUserId,
  muteType: "notifications"
      };
      
      await blockMuteService.muteNotifications(mappedMuteData);
      
      // Refresh the list after muting
      await fetchBlockedMutedUsers();
    } catch (err: any) {
      setError("Failed to mute notifications.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mute UGC (User Generated Content)
  const muteUgc = async (
  muteData: {mutedUserId: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Create proper MuteData object
      const mappedMuteData: MuteData = {
  mutedUserId: muteData.mutedUserId,
  muteType: "ugc"
      };
      
      await blockMuteService.muteUgc(mappedMuteData);
      
      // Refresh the list after muting
      await fetchBlockedMutedUsers();
    } catch (err: any) {
      setError("Failed to mute UGC.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // Unblock a user
  const unblockUser = async (
  blockedUserId: string,
  muteType?: string) => {
    setLoading(true);
    setError(null);

    try {
      await blockMuteService.unblockUser(blockedUserId);
      // Refresh the list after unblocking
      await fetchBlockedMutedUsers();
    } catch (err: any) {
      setError("Failed to unblock user.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if a user is blocked or muted
  const checkBlockMuteStatus = async (
  targetUserId: string): Promise<BlockStatusResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Use the correct method name (getBlockStatus instead of checkBlockStatus)
      const status = await blockMuteService.getBlockStatus(targetUserId);
      return status;
    } catch (err: any) {
      setError("Failed to check block/mute status.");
      console.error(err);
      return {
  isBlocked: false,
  isMuted: false
  };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    blockedMutedUsers,
    fetchBlockedMutedUsers,
    blockUser,
    muteNotifications,
    muteUgc,
    unblockUser,
    checkBlockMuteStatus
  };
};

export default useBlockMute;