import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export interface CommunityGroup {id: string;
  name: string;
  description?: string;
  category: string;
  createdBy: {id: string;
  membername: string;
  };
isPrivate: boolean;
memberCount: number;
isMember: boolean;
createdAt: string;
updatedAt: string;
}

export const useCommunityGroups = () => {
  const [groups, setGroups] = React.useState<CommunityGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await ApiService.request("/groups", {method: "GET"
      });

      if (response) {
        // Transform the data to match our interface (ApiService.request returns response.data directly)
        const transformedGroups = (response as any[]).map((group: any) => ({id: group.id,
  name: group.name,
  description: group.description,
  category: group.category,
  createdBy: {id: group.created_by,
  membername: group.creator_membername
          },
isPrivate: group.is_private,
memberCount: group.member_count || 0,
isMember: group.is_member || false,
createdAt: group.created_at,
updatedAt: group.updated_at
        }));

        setGroups(transformedGroups);
        setError(null);
      } else {
        setError("Failed to fetch groups");
      }
    } catch (err) {
      setError("An error occurred while fetching groups");
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (
  groupData: {name: string;
  description?: string;
  category: string;
  isPrivate: boolean;
  }) => {
    try {
      const response = await ApiService.request("/groups", {method: "POST",
  data: groupData
      });

      if (response) {
        // Fetch groups again to include the new one (ApiService.request returns response.data directly)
        await fetchGroups();
        return {success: true,
  message: "Group created successfully",
  group: response
        };
      } else {
        return {success: false,
  message: "Failed to create group" };
      }
    } catch (err) {
      console.error("Error creating group:", err);
      return {success: false,
  message: "Failed to create group" };
    }
  };

  const joinGroup = async (
  groupId: string) => {
    try {
      const response = await ApiService.request(`/groups/${groupId}/join`, {method: "POST"
      });

      if (response) {
        // Update the group in our local state (ApiService.request returns response.data directly)
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
isMember: true,
memberCount: (response as any).member_count
                }
              : group,
          ),
        );
        return {success: true,
  message: "Joined group successfully" };
      } else {
        return {success: false,
  message: "Failed to join group" };
      }
    } catch (err) {
      console.error("Error joining group:", err);
      return {success: false,
  message: "Failed to join group" };
    }
  };

  const leaveGroup = async (
  groupId: string) => {
    try {
      const response = await ApiService.request(`/groups/${groupId}/leave`, {method: "POST"
      }) as any;

      if (response) {
        // Update the group in our local state
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
isMember: false,
memberCount: response.member_count
                }
              : group,
          ),
        );
        return {success: true,
  message: "Left group successfully" };
      } else {
        return {success: false,
  message: "Failed to leave group" };
      }
    } catch (err) {
      console.error("Error leaving group:", err);
      return {success: false,
  message: "Failed to leave group" };
    }
  };

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const refreshGroups = () => {
    fetchGroups();
  };

  return {
    groups,
    loading,
    error,
    refreshGroups,
    createGroup,
    joinGroup,
    leaveGroup
  };
};
