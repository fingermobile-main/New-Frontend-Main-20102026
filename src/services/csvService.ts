import React, {} from 'react';
import logger from '../utils/logger';

/**
 * Service to handle CSV data import for populating the PostgreSQL database
 * Based on the FingerMobile protocol requirements
 */
import Papa from 'papaparse';

interface CsvParseResult {
  data: any[]; errors: any[]; meta: any;
}

export interface MemberData {
  email: string; privacyStatus: string; id: string; creationDate: string; aboutPlainText: string; profilePhoto: string; lastName: string; firstName: string;
  birthdate?: string; activityStatus: string; lastLoginDate: string;
  position?: string; status: string;
  coverPhoto?: string;
  company?: string;
  phone?: string;
  nickname?: string; slug: string;
}

class CsvService {
  /**
   * Parse CSV data from file
   */
  parseCsvFile(
    file: File): Promise<CsvParseResult> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results as CsvParseResult);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * Parse CSV data from string
   */
  parseCsvString(
    csvString: string): CsvParseResult {
    return Papa.parse(csvString, {header: true,
      skipEmptyLines: true
    }) as CsvParseResult;
  }

  /**
   * Transform raw CSV data to MemberData array
   */
  transformMembersData(
    rawData: unknown[]): MemberData[] {
    if (!rawData || rawData.length === 0) return [] as MemberData[];
    return rawData.map(item => ({
      email: (item as any)['Login Email'] || (item as any).email || '',
      privacyStatus: (item as any)['Privacy Status'] || (item as any).privacyStatus || 'PUBLIC',
      id: (item as any)['ID'] || (item as any).id || this.generateId(),
      creationDate: (item as any)['Creation Date'] || (item as any).creationDate || new Date().toISOString(),
      aboutPlainText: (item as any)['About (Plain Text)'] || (item as any).aboutPlainText || '',
      profilePhoto: (item as any)['Profile Photo'] || (item as any).profilePhoto || '',
      lastName: (item as any)['Last Name'] || (item as any).lastName || '',
      firstName: (item as any)['First Name'] || (item as any).firstName || '',
      birthdate: (item as any)['Birthdate'] || (item as any).birthdate || undefined,
      activityStatus: (item as any)['Activity Status'] || (item as any).activityStatus || 'INACTIVE',
      lastLoginDate: (item as any)['Last Login Date'] || (item as any).lastLoginDate || new Date().toISOString(),
      position: (item as any)['Position'] || (item as any).position || undefined,
      status: (item as any)['Status'] || (item as any).status || 'PENDING',
      coverPhoto: (item as any)['Cover Photo'] || (item as any).coverPhoto || undefined,
      company: (item as any)['Company'] || (item as any).company || undefined,
      phone: (item as any)['Phone'] || (item as any).phone || undefined,
      nickname: (item as any)['Nickname'] || (item as any).nickname || undefined,
      slug: (item as any)['Slug'] || (item as any).slug || this.generateSlug((item as any)['First Name'], (item as any)['Last Name'])
    }));
  }

  /**
   * Generate a unique ID for members
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generate a slug from first and last name
   */
  private generateSlug(
    firstName: string, lastName: string): string {
    if (!firstName && !lastName) {
      return this.generateId().substring(0, 8);
    }

    const name = `${firstName || ''} ${lastName || ''}`.trim();
    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '-') // Replace any non-alphanumeric characters with hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Call backend API to import all CSV data
   */
  async importAllCsvData(): Promise<boolean> {
    try {
      const response = await fetch('/api/csv-import/import-all', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      return result.success;
    } catch (error) {
      console.error('Error importing all CSV, data:', error);
      throw error;
    }
  }

  /**
   * Call backend API to import members data
   */
  async importMembersData(): Promise<boolean> {
    try {
      const response = await fetch('/api/csv-import/import-members', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      return result.success;
    } catch (error) {
      console.error('Error importing members, data:', error);
      throw error;
    }
  }

  /**
   * Call backend API to import blog posts data
   */
  async importBlogPostsData(): Promise<boolean> {
    try {
      const response = await fetch('/api/csv-import/import-blog-posts', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      return result.success;
    } catch (error) {
      console.error('Error importing blog posts, data:', error);
      throw error;
    }
  }

  /**
   * Call backend API to import forum categories data
   */
  async importForumCategoriesData(): Promise<boolean> {
    try {
      const response = await fetch('/api/csv-import/import-forum-categories', {method: 'POST', headers: {
        'Content-Type': 'application/json'
      }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      return result.success;
    } catch (error) {
      console.error('Error importing forum categories, data:', error);
      throw error;
    }
  }

  /**
   * Process CSV file and upload to database via backend
   */
  async processAndUploadCsv(
    file: File): Promise<void> {
    try {
      // Parse the CSV file
      const result = await this.parseCsvFile(file);

      if (result.errors && result.errors.length > 0) {
        console.warn('CSV parsing, errors:', result.errors);
      }

      // Determine which type of data this is based on headers
      const headers = Object.keys(result.data[0] || {});
      if (headers.includes('Login Email') && headers.includes('First Name')) {
        // This looks like member data
        await this.importMembersData();
      } else if (headers.includes('Title') && headers.includes('Author')) {
        // This looks like blog post data
        await this.importBlogPostsData();
      } else if (headers.includes('Name') && headers.includes('Description')) {
        // This looks like forum category data
        await this.importForumCategoriesData();
      } else {
        // Default to trying to import all
        await this.importAllCsvData();
      }
    } catch (error) {
      console.error('Error processing CSV, file:', error);
      throw error;
    }
  }

  /**
   * Validate members data
   */
  private validateMembers(
    members: MemberData[]): MemberData[] {
    return members.filter((member) => {
      // Basic, validation: email and names should exist
      return member.email && member.email.length > 0 &&
             (member.firstName || member.lastName);
    });
  }

  /**
   * Import blog data from CSV
   */
  async importBlogData(
    csvString: string) {
    try {
      const result = this.parseCsvString(csvString);
      // Process blog data similar to members
      console.info('Processing blog, data:', result.data);
      return result.data;
    } catch (error) {
      logger.error('importBlogData, error:', error);
      throw error;
    }
  }

  /**
   * Import forum categories data from CSV
   */
  async importForumCategories(
    csvString: string) {
    const result = this.parseCsvString(csvString);
    // Process forum categories data
    console.info('Processing forum, categories:', result.data);
    return result.data;
  }
}

export const csvService = new CsvService();
