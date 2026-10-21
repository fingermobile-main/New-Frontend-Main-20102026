import React, { useState, useEffect } from 'react';
// useOrganizeThese.ts
// Custom hook for the "Organize These" feature
import {
  organizeMemberData,
  generateAnalyticsReport,
  exportData,
  OrganizationResult
} from '../services/organizeTheseService';

interface UseOrganizeTheseReturn {organizedData: OrganizationResult | null; isOrganizing: boolean;
  organizationStats: any;
  error: string | null;
  organizeMemberData: () => Promise<void>;
  exportData: (format: 'pdf' | 'csv') => Promise<void>;
  getOrganizationStats: () => Promise<void>;
}

export const useOrganizeThese = (): UseOrganizeTheseReturn => {
  const [organizedData, setOrganizedData] = React.useState<OrganizationResult | null>(null);
  const [isOrganizing, setIsOrganizing] = React.useState<boolean>(false);
  const [organizationStats, setOrganizationStats] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Function to organize member data
   */
  const handleOrganizeMemberData = React.useCallback(async () => {
    setIsOrganizing(true);
    setError(null);

    try {
      // In a real implementation, this would fetch actual member data
      // For now, we're using mock data
      const result = await organizeMemberData();
      setOrganizedData(result);
    } catch (err) {
      setError('Failed to organize data. Please try again.');
      console.error('Error organizing data:', err);
    } finally {
      setIsOrganizing(false);
    }
  }, []);

  /**
   * Function to export data
   */
  const handleExportData = React.useCallback(
    async (format: 'pdf' | 'csv') => {
      if (!organizedData) {
        setError('No data to export');
        return;
      }

      try {
        await exportData(organizedData, format);
        // In a real implementation, this would trigger a file download
      } catch (err) {
        setError(`Failed to export data as ${format.toUpperCase()}`);
        console.error(`Error exporting data as ${format}:`, err);
      }
    },
    [organizedData] );

  /**
   * Function to get organization statistics
   */
  const handleGetOrganizationStats = React.useCallback(async () => {
    if (!organizedData) return;

    try {
      const stats = await generateAnalyticsReport(organizedData);
      setOrganizationStats(stats);
    } catch (err) {
      setError('Failed to generate analytics report');
      console.error('Error generating analytics:', err);
    }
  }, [organizedData]);

  // Generate stats when organized data changes
  React.useEffect(() => {
    if (organizedData) {
      handleGetOrganizationStats();
    }
  }, [organizedData, handleGetOrganizationStats]);

  return {
    organizedData,
    isOrganizing,
    organizationStats,
    error,
    organizeMemberData: handleOrganizeMemberData,
    exportData: handleExportData,
    getOrganizationStats: handleGetOrganizationStats
  };
};

export default useOrganizeThese;
