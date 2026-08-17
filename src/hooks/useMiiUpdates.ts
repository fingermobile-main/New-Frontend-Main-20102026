import React, { useState, useEffect } from 'react';
// useMiiUpdates.ts
// Super-enhanced custom hook for high-frequency ephemeral updates, interaction analytics, and robust state orchestration.

import { api } from '../services/api';

// --- Enhanced Domain Interfaces ---

export interface MiiUpdate {
  id: string;
  type: "image" | "video" | "text" | "voice";
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  views: number;
  expiresIn: Date;
  isViewed: boolean;
  isPrivate?: boolean;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface MiiStats {
  total: number;
  unviewed: number;
  authors: number;
  interactions: number;
}

export interface CreateMiiUpdatePayload {
  content: string;
  contentType: "image" | "video" | "text" | "voice";
  isPrivate?: boolean;
  expiresInHours?: number;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

// --- Hook Implementation ---

export const useMiiUpdates = () => {
  const [updates, setUpdates] = React.useState<MiiUpdate[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<MiiStats>({
    total: 0,
    unviewed: 0,
    authors: 0,
    interactions: 0
  });

  /**
   * Atomic Aggregator Pipeline - Fetches structural updates and user telemetry profiles concurrently.
   */
  const coreSynchronizationPipeline = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // Concurrency optimizing using parallel settlement loops
      const [updatesRes, statsRes] = await Promise.allSettled([
        api.get("/mii/updates"),
        api.get("/mii/stats")
      ]);

      // 1. Process Updates Payload
      if (updatesRes.status === 'fulfilled' && updatesRes.value.data) {
        const now = new Date();
        const transformedUpdates: MiiUpdate[] = updatesRes.value.data
          .map((update: any): MiiUpdate => ({
            id: update.id,
            type: update.content_type,
            content: update.content,
            author: {
              name: update.author_membername || "Anonymous Member",
              avatar: update.author_avatar || ""
            },
            timestamp: update.created_at,
            views: update.view_count || 0,
            expiresIn: new Date(update.expires_at),
            isViewed: update.is_viewed || false,
            isPrivate: update.is_private || false,
            likes: update.like_count || 0,
            comments: update.comment_count || 0,
            isLiked: update.is_liked || false
          }))
          // Algorithmic Guard: Filter out active memory payloads that have already naturally expired
          .filter((update: MiiUpdate) => update.expiresIn > now);

        setUpdates(transformedUpdates);
        setError(null);
      } else if (updatesRes.status === 'rejected') {
        setError("Failed to systematically pull structural feed content.");
        console.error("Mii Updates Sync pipeline failure:", updatesRes.reason);
      }

      // 2. Process Analytics Stats Metrics
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setStats({
          total: statsRes.value.data.total || 0,
          unviewed: statsRes.value.data.unviewed || 0,
          authors: statsRes.value.data.authors || 0,
          interactions: statsRes.value.data.interactions || 0
        });
      }

    } catch (globalErr) {
      setError("An unexpected exception occurred during live ecosystem updates sync.");
      console.error("Global pipeline failure:", globalErr);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Optimistic Action Execution Core for Fast-Feedback Interactions
   */
  const likeUpdate = React.useCallback(async (updateId: string): Promise<ActionResponse> => {
    let rollbackUpdates: MiiUpdate[] = [];
    
    // Step 1: Execute immediate UI mutation before waiting for the database server
    setUpdates((prevUpdates) => {
      rollbackUpdates = [...prevUpdates]; // Cache state snapshot
      return prevUpdates.map((update) => {
        if (update.id !== updateId) return update;
        const willBeLiked = !update.isLiked;
        return {
          ...update,
          isLiked: willBeLiked,
          likes: willBeLiked ? update.likes + 1 : Math.max(0, update.likes - 1)
        };
      });
    });

    try {
      const response = await api.post(`/mii/updates/${updateId}/like`);
      if (response.data) {
        // Step 2: Harmonize the localized prediction with explicit server authority data
        setUpdates((prev) =>
          prev.map((up) =>
            up.id === updateId ? { ...up, likes: response.data.like_count } : up
          )
        );
        return { success: true, message: response.data.message || "Successfully recorded reaction." };
      }
      throw new Error("Invalid remote response schema structure.");
    } catch (err) {
      console.error("Reverting reaction operation. Error:", err);
      setUpdates(rollbackUpdates); // Immediate state fallback roll-back safely
      return { success: false, message: "Server connection failed. Could not register like." };
    }
  }, []);

  /**
   * Safe tracking handler for logging consumer viewport exposure
   */
  const viewUpdate = React.useCallback(async (updateId: string): Promise<ActionResponse> => {
    // Only track if it hasn't already been marked as viewed in the current layout context
    const currentTarget = updates.find(u => u.id === updateId);
    if (currentTarget?.isViewed) {
      return { success: true, message: "Already cataloged." };
    }

    try {
      const response = await api.post(`/mii/updates/${updateId}/view`);
      if (response.data) {
        setUpdates((prevUpdates) =>
          prevUpdates.map((update) =>
            update.id === updateId
              ? { ...update, views: response.data.view_count, isViewed: true }
              : update
          )
        );
        return { success: true, message: response.data.message || "View metrics registered." };
      }
      return { success: false, message: "Payload response resolution failed." };
    } catch (err) {
      console.error("Error logging client tracking impressions:", err);
      return { success: false, message: "Analytics logging failed." };
    }
  }, [updates]);

  /**
   * Process and append fresh content streams with security injection sanitization steps
   */
  const createUpdate = React.useCallback(async (updateData: CreateMiiUpdatePayload): Promise<ActionResponse> => {
    // Security Content Sanitization Baseline
    if (!updateData.content || updateData.content.trim() === "") {
      return { success: false, message: "Invalid payload input data. Content text cannot be empty." };
    }

    try {
      const response = await api.post("/mii/updates", {
        content: updateData.content,
        content_type: updateData.contentType,
        is_private: updateData.isPrivate || false,
        expires_in_hours: updateData.expiresInHours || 24 // Defaults to standard 24-hour cycle
      });

      if (response.data) {
        await coreSynchronizationPipeline(); // Full rehydration sweep
        return { success: true, message: response.data.message || "Feed entry created successfully." };
      }
      return { success: false, message: "No data payload returned from asset compilation." };
    } catch (err) {
      console.error("Critical error while pushing fresh content asset updates:", err);
      return { success: false, message: "Failed to broadcast content stream update." };
    }
  }, [coreSynchronizationPipeline]);

  // Structural Hook Hydration Cycle
  React.useEffect(() => {
    coreSynchronizationPipeline();
  }, [coreSynchronizationPipeline]);

  return {
    updates,
    loading,
    error,
    stats,
    refreshUpdates: coreSynchronizationPipeline,
    likeUpdate,
    viewUpdate,
    createUpdate
  };
};