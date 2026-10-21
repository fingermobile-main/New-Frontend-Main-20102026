/**
 * NYSC Service - National Youth Service Corps Integration
 * Handles corps member profiles, postings, service activities, live events and discussions
 */

import { api } from './api';

export interface CorpsMember {
  id: string | number;
  user_id?: string | number;
  member_id?: string;
  state_code: string;
  full_name?: string;
  state_of_origin?: string;
  state_of_deployment?: string;
  batch: string;
  stream: string | number;
  ppa?: string;
  ppa_name?: string;
  ppa_address?: string;
  supervisor?: string;
  status: 'active' | 'mobilized' | 'posted' | 'serving' | 'passed_out' | string;
  registration_date?: string;
  created_at?: string;
}

export interface Posting {
  id: string;
  corps_member_id: string;
  state: string;
  lga: string;
  ppa_type: string;
  ppa_name: string;
  posted_date: string;
  resumption_date: string;
}

export interface CDSActivity {
  id: string;
  name: string;
  description?: string;
  meeting_day: string;
  location: string;
  members_count: number;
}

export interface Clearance {
  id: string;
  corps_member_id: string;
  type: 'monthly' | 'quarterly' | 'final';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
}

export interface NyscEvent {
  id: string | number;
  title: string;
  date: string;
  location: string;
  description?: string;
  participants?: number;
  participants_count?: number;
  organizer: string;
}

export interface NyscDiscussion {
  id: string | number;
  title: string;
  author: string;
  timeAgo?: string;
  time_ago?: string;
  content: string;
  replies: number;
  views: number;
}

export interface NyscStats {
  totalMembers: number;
  activeMembers: number;
  statesCount: number;
  batchesCount: number;
}

class NyscService {
  private baseUrl = '/nysc';

  async getStats(): Promise<NyscStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data?.data || { totalMembers: 0, activeMembers: 0, statesCount: 0, batchesCount: 0 };
    } catch (error) {
      console.error('Failed to get NYSC stats:', error);
      return { totalMembers: 0, activeMembers: 0, statesCount: 0, batchesCount: 0 };
    }
  }

  async getEvents(): Promise<NyscEvent[]> {
    try {
      const response = await api.get(`${this.baseUrl}/events`);
      const events = response.data?.data || [];
      return events.map((e: any) => ({
        ...e,
        participants: e.participants || e.participants_count || 0
      }));
    } catch (error) {
      console.error('Failed to get NYSC events:', error);
      return [];
    }
  }

  async createEvent(eventData: Partial<NyscEvent>): Promise<NyscEvent> {
    const response = await api.post(`${this.baseUrl}/events`, eventData);
    return response.data?.data;
  }

  async getDiscussions(): Promise<NyscDiscussion[]> {
    try {
      const response = await api.get(`${this.baseUrl}/discussions`);
      const discussions = response.data?.data || [];
      return discussions.map((d: any) => ({
        ...d,
        timeAgo: d.timeAgo || d.time_ago || 'Recently'
      }));
    } catch (error) {
      console.error('Failed to get NYSC discussions:', error);
      return [];
    }
  }

  async createDiscussion(discussionData: { title: string; content: string }): Promise<NyscDiscussion> {
    const response = await api.post(`${this.baseUrl}/discussions`, discussionData);
    return response.data?.data;
  }

  async getMembers(params?: any): Promise<CorpsMember[]> {
    try {
      const response = await api.get(`${this.baseUrl}/members`, { params });
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to get NYSC members:', error);
      return [];
    }
  }

  async registerMember(data: Partial<CorpsMember>): Promise<any> {
    const response = await api.post(`${this.baseUrl}/registration`, data);
    return response.data;
  }

  async getAllowances(): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/allowances`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to get NYSC allowances:', error);
      return [];
    }
  }

  async getProfile(memberId: string): Promise<CorpsMember> {
    const response = await api.get(`${this.baseUrl}/profile/${memberId}`);
    return response.data;
  }

  async updateProfile(profileData: Partial<CorpsMember>): Promise<CorpsMember> {
    const response = await api.put(`${this.baseUrl}/profile`, profileData);
    return response.data;
  }

  async getPosting(corpsMemberId: string): Promise<Posting> {
    const response = await api.get(`${this.baseUrl}/postings/${corpsMemberId}`);
    return response.data;
  }

  async getCDSActivities(state: string): Promise<CDSActivity[]> {
    const response = await api.get(`${this.baseUrl}/cds-activities`, { params: { state } });
    return response.data;
  }

  async joinCDS(activityId: string): Promise<void> {
    await api.post(`${this.baseUrl}/cds-activities/${activityId}/join`);
  }

  async submitClearance(clearance: Partial<Clearance>): Promise<Clearance> {
    const response = await api.post(`${this.baseUrl}/clearances`, clearance);
    return response.data;
  }

  async getMyClearances(): Promise<Clearance[]> {
    const response = await api.get(`${this.baseUrl}/clearances/my`);
    return response.data;
  }

  async getAnnouncements(): Promise<{ id: string; title: string; content: string; date: string }[]> {
    const response = await api.get(`${this.baseUrl}/announcements`);
    return response.data;
  }
}

export const nyscService = new NyscService();
export default nyscService;
