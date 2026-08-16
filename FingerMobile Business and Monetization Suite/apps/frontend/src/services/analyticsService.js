/*
 * FingerMobile Protocol™ - Analytics Service for Frontend
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

class AnalyticsService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || '/api/v1';
  }

  async getPublishedUGC(userId) {
    const response = await fetch(`${this.baseUrl}/analytics/published/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch published UGC analytics');
    }

    return response.json();
  }

  async getWatchSegments(contentId) {
    const response = await fetch(`${this.baseUrl}/analytics/published/${contentId}/watch-segments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch watch segments');
    }

    return response.json();
  }

  async exportToCSV(userId, dateRange, contentType) {
    const response = await fetch(`${this.baseUrl}/analytics/export/csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, dateRange, contentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to export data to CSV');
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async exportToPDF(userId, dateRange, contentType) {
    const response = await fetch(`${this.baseUrl}/analytics/export/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, dateRange, contentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to export data to PDF');
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async getLiveMetrics(contentId) {
    const response = await fetch(`${this.baseUrl}/analytics/live-metrics/${contentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch live metrics');
    }

    return response.json();
  }
}

export default new AnalyticsService();