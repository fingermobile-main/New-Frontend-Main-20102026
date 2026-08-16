/*
 * FingerMobile Protocol™ - Content Manager Service for Frontend
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

class ContentManagerService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || '/api/v1';
  }

  async getComments(userId, respondedStatus, sortBy) {
    let url = `${this.baseUrl}/content-manager/comments/${userId}`;
    const params = new URLSearchParams();
    if (respondedStatus) params.append('respondedStatus', respondedStatus);
    if (sortBy) params.append('sortBy', sortBy);
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  async respondToComment(commentId, responseText) {
    const response = await fetch(`${this.baseUrl}/content-manager/comments/respond/${commentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responseText }),
    });

    if (!response.ok) {
      throw new Error('Failed to respond to comment');
    }

    return response.json();
  }

  async getMentions(userId) {
    const response = await fetch(`${this.baseUrl}/content-manager/mentions/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentions');
    }

    return response.json();
  }

  async getFollows(userId) {
    const response = await fetch(`${this.baseUrl}/content-manager/follows/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch follows');
    }

    return response.json();
  }

  async getModerationAssist(userId) {
    const response = await fetch(`${this.baseUrl}/content-manager/moderation-assist/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch moderation assist');
    }

    return response.json();
  }

  async moderateContent(itemId, decision, moderatorNotes) {
    const response = await fetch(`${this.baseUrl}/content-manager/moderate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, decision, moderatorNotes }),
    });

    if (!response.ok) {
      throw new Error('Failed to moderate content');
    }

    return response.json();
  }

  async getActivityLog(userId, timeRange, activityType, criteria) {
    let url = `${this.baseUrl}/content-manager/activity-log/${userId}`;
    const params = new URLSearchParams();
    if (timeRange) params.append('timeRange', timeRange);
    if (activityType) params.append('activityType', activityType);
    if (criteria) params.append('criteria', JSON.stringify(criteria));
    if (params.toString()) url += '?' + params.toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity log');
    }

    return response.json();
  }
}

export default new ContentManagerService();