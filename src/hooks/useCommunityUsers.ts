import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { Member } from '../types';

interface UseCommunityUsersResult {members: Member[];
  loading: boolean;
  error: string | null;
  refreshMembers: () => void;
}

export const useCommunityUsers = (): UseCommunityUsersResult => {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      const response = await ApiService.get<Member[]>("/community/users");
      setMembers(response.data || []);
    } catch (err) {
      setError("Failed to fetch community members.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  const refreshMembers = () => {
    fetchMembers();
  };

  return { members, loading, error, refreshMembers };
};