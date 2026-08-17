import React, {} from 'react';
import { api } from './api';
import { Member } from '../types';

export interface BlockData {
  blockedUserId: string;
  reason?: string;
}

export interface MuteData {
  mutedUserId: string;
  muteType: "notifications" | "ugc";
  reason?: string;
}

export interface BlockStatusResponse {
  isBlocked: boolean;
  isMuted: boolean;
}

export interface BlocksResponse {
  blocks: Member[];
  mutes: Member[];
}

class BlockMuteService {
  // =========================================================================
  // Block Mutations
  // =========================================================================

  async blockUser(blockData: BlockData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/block", blockData);
      return {
        success: true,
        message: response.data?.message || "User blocked successfully"};
    } catch (error: any) {
      console.error("Block user error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to block user"};
    }
  }

  async unblockUser(blockedId: string): Promise<{ success: boolean; message: string }> {
    try {
      // FIXED: Simplified path assuming semantic separation from mute types. 
      // Adjust path if your backend strictly demands a dual-purpose endpoint.
      const response = await api.delete(`/block/${blockedId}`);
      return {
        success: true,
        message: response.data?.message || "User unblocked successfully"};
    } catch (error: any) {
      console.error("Unblock user error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to unblock user"};
    }
  }

  // =========================================================================
  // Mute Mutations
  // =========================================================================

  /**
   * Consolidated Mute Action using polymorphic payloads
   */
  async muteUser(muteData: MuteData): Promise<{ success: boolean; message: string }> {
    try {
      const endpoint = muteData.muteType === "notifications" ? "/mute/notifications" : "/mute/ugc";
      const response = await api.post(endpoint, muteData);
      return {
        success: true,
        message: response.data?.message || `${muteData.muteType === 'notifications' ? 'Notifications' : 'UGC'} muted successfully`};
    } catch (error: any) {
      console.error(`Mute ${muteData.muteType} error:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Failed to mute ${muteData.muteType}`};
    }
  }

  async unmuteUser(mutedId: string, muteType: "notifications" | "ugc"): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/mute/${mutedId}/${muteType}`);
      return {
        success: true,
        message: response.data?.message || "User unmuted successfully"};
    } catch (error: any) {
      console.error("Unmute user error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to unmute user"};
    }
  }

  // =========================================================================
  // Queries & Status Checks
  // =========================================================================

  async getBlocks(params: { page?: number; limit?: number } = {}): Promise<BlocksResponse> {
    try {
      const response = await api.get("/blocks", { params });
      // FIXED: Added missing commas in the fallback object literal
      return response.data || { blocks: [], mutes: [] };
    } catch (error: any) {
      console.error("Get blocks error:", error);
      return { blocks: [], mutes: [] };
    }
  }

  async getBlockStatus(targetUserId: string): Promise<BlockStatusResponse> {
    try {
      const response = await api.get(`/block-status/${targetUserId}`);
      // FIXED: Added missing commas in the fallback object literal
      return response.data || { isBlocked: false, isMuted: false };
    } catch (error: any) {
      console.error("Get block status error:", error);
      return { isBlocked: false, isMuted: false };
    }
  }

  // =========================================================================
  // Convenience Methods for Hooks
  // =========================================================================

  async muteNotifications(muteData: MuteData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/mute", { ...muteData, muteType: "notifications" });
      return {
        success: true,
        message: response.data?.message || "Notifications muted successfully"};
    } catch (error: any) {
      console.error("Mute notifications error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to mute notifications"};
    }
  }

  async muteUgc(muteData: MuteData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/mute", { ...muteData, muteType: "ugc" });
      return {
        success: true,
        message: response.data?.message || "UGC muted successfully"};
    } catch (error: any) {
      console.error("Mute UGC error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to mute UGC"};
    }
  }
}

export const blockMuteService = new BlockMuteService();
export default blockMuteService;