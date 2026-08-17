import React, {} from 'react';
/**
 * NYSC Service - National Youth Service Corps Integration
 * Handles corps member profiles, postings, and service activities
 */

import { api } from './api';

export interface CorpsMember {id: string;
  member_id: string;
  state_code: string;
  batch: string;
  stream: number;
  ppa_name: string;
  ppa_address: string;
  status: 'mobilized' | 'posted' | 'serving' | 'passed_out';
  registration_date: string;
}

export interface Posting {id: string;
  corps_member_id: string;
  state: string;
  lga: string;
  ppa_type: string;
  ppa_name: string;
  posted_date: string;
  resumption_date: string;
}

export interface CDSActivity {id: string;
  name: string;
  description?: string;
  meeting_day: string;
  location: string;
  members_count: number;
}

export interface Clearance {id: string;
  corps_member_id: string;
  type: 'monthly' | 'quarterly' | 'final';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
}

class NyscService {
  private baseUrl = '/api/nysc';

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
    const response = await api.get(`${this.baseUrl}/cds-activities`, { params: { state }
    });
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

  async getAnnouncements(): Promise<{ id: string; title: string;
  content: string;
  date: string }[]> {
    const response = await api.get(`${this.baseUrl}/announcements`);
    return response.data;
  }
}

export const nyscService = new NyscService();
