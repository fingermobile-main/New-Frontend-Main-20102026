/*
 * FingerMobile Protocol™ - Content Service for Frontend
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

class ContentService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || '/api/v1';
  }

  async createContent(contentData) {
    const response = await fetch(`${this.baseUrl}/content/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create content');
    }

    return response.json();
  }

  async scheduleContent(scheduleData) {
    const response = await fetch(`${this.baseUrl}/content/schedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule content');
    }

    return response.json();
  }

  async getContentLibrary(userId) {
    const response = await fetch(`${this.baseUrl}/content/library/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch content library');
    }

    return response.json();
  }

  async bulkUpload(contents) {
    const response = await fetch(`${this.baseUrl}/content/bulk-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload content in bulk');
    }

    return response.json();
  }

  async getContentPlanner(userId) {
    const response = await fetch(`${this.baseUrl}/content/planner/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch content planner');
    }

    return response.json();
  }

  async addPlannedContent(plannedContent) {
    const response = await fetch(`${this.baseUrl}/content/planner`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plannedContent),
    });

    if (!response.ok) {
      throw new Error('Failed to add planned content');
    }

    return response.json();
  }

  async getFilters(userId) {
    const response = await fetch(`${this.baseUrl}/content/filters/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch filters');
    }

    return response.json();
  }
}

export default new ContentService();