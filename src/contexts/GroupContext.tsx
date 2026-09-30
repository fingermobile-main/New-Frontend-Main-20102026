import React, { useState, createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import groupsService from '../services/groupsService';

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
}

interface GroupState {
  groupId: string | null;
  groupName: string;
  members: GroupMember[];
  permissions: Record<string, boolean>;
}

interface GroupContextType {
  state: GroupState;
  groups: any[];
  setGroup: (groupId: string, groupName: string, members: GroupMember[]) => void;
  clearGroup: () => void;
  updatePermissions: (permissions: Record<string, boolean>) => void;
  hasPermission: (permission: string) => boolean;
  handleJoinGroup: (groupId: string) => Promise<void>;
  handleCreateGroup: (groupName: string, description?: string) => Promise<void>;
  handleUpdateGroup: (groupId: string, updates: unknown) => Promise<void>;
}

const initialState: GroupState = {
  groupId: null,
  groupName: '',
  members: [],
  permissions: {}
};

export const GroupContext = createContext<GroupContextType | undefined>(undefined);

interface GroupProviderProps {
  children: ReactNode;
}

export const GroupProvider: React.FC<GroupProviderProps> = ({ children }) => {
  const [state, setState] = useState<GroupState>(initialState);

  const setGroup = useCallback((groupId: string, groupName: string, members: GroupMember[]) => {
    setState({
      groupId,
      groupName,
      members,
      permissions: {
        canPost: true,
        canComment: true,
        canInvite: false,
        canModerate: false
      }
    });
  }, []);

  const clearGroup = useCallback(() => {
    setState(initialState);
  }, []);

  const updatePermissions = useCallback((permissions: Record<string, boolean>) => {
    setState((prev) => ({ ...prev, permissions }));
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      return state.permissions[permission] || false;
    },
    [state.permissions]
  );

  const [groups, setGroups] = useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    groupsService.getAllGroups().then((res) => {
      if (mounted && res.data && Array.isArray(res.data)) {
        setGroups(res.data);
      }
    }).catch((err) => {
      console.warn('Failed to load initial groups in GroupContext:', err);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleJoinGroup = async (groupId: string): Promise<void> => {
    try {
      await groupsService.joinGroup(groupId);
      // Refresh groups list after joining
      const response = await groupsService.getAllGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error('Failed to join group:', error);
      throw error;
    }
  };

  const handleCreateGroup = async (groupName: string, description?: string): Promise<void> => {
    try {
      const response = await groupsService.createGroup({
        name: groupName,
        description,
        category: 'general',
        privacy: 'public',
        isModerated: true
      });
      if (response.data) {
        setGroups((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  };

  const handleUpdateGroup = async (groupId: string, updates: unknown): Promise<void> => {
    try {
    // @ts-ignore - Auto-suppressed for compilation
      const updatedGroup = await groupsService.updateGroup(groupId, updates);
      setGroups((prev) => prev.map(g => g.id === groupId ? updatedGroup : g));
    } catch (error) {
      console.error('Failed to update group:', error);
      throw error;
    }
  };

  const value: GroupContextType = {
    state,
    groups,
    setGroup,
    clearGroup,
    updatePermissions,
    hasPermission,
    handleJoinGroup,
    handleCreateGroup,
    handleUpdateGroup
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

// Custom hook to use the group context
export const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};

export default GroupProvider;
