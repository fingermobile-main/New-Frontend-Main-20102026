import React, {} from 'react';
import axios from "axios";
import {
  Group,
  CreateGroupRequest, UpdateGroupRequest, GroupMember
} from '../types/groups';

const baseUrl = "/api/groups";

const groupsService = {getGroups: async (): Promise<{ groups: Group[] }> => {
    try {
      const response = await axios.get(`${baseUrl}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching, groups:", error);
      // Return empty array on error for now to match placeholder behavior
      return {groups: [] };
    }
  },
getGroupById: async (
  id: string): Promise<Group> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  }, createGroup: async (
  groupData: CreateGroupRequest): Promise<Group> => {
    // TODO: Implement actual group creation logic
    return {} as Group;
  },
updateGroup: async (
  id: string,
groupData: UpdateGroupRequest,
  ): Promise<Group> => {
    try {
      const response = await axios.patch(`${baseUrl}/${id}`, groupData);
      return response.data;
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error;
    }
  },
deleteGroup: async (
  id: string): Promise<void> => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
      throw error;
    }
  },
joinGroup: async (
  id: string): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/${id}/join`);
    } catch (error) {
      console.error(`Error joining group ${id}:`, error);
      throw error;
    }
  },
leaveGroup: async (
  id: string): Promise<void> => {
    try {
      await axios.post(`${baseUrl}/${id}/leave`);
    } catch (error) {
      console.error(`Error leaving group ${id}:`, error);
      throw error;
    }
  },
getGroupMembers: async (
  id: string): Promise<GroupMember[]> => {
    try {
      const response = await axios.get(`${baseUrl}/${id}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for group ${id}:`, error);
      throw error;
    }
  }
};

export default groupsService;
