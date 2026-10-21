import React, {} from 'react';
import { MediaTemplate } from '../types';

// Mock media template service implementation
export const mediaTemplateService = {
  async getAllTemplates(): Promise<MediaTemplate[]> {
    // In a real app, this would call the backend API
    return [
      {id: 'template-1', name: 'Social Media Template',
        description: 'Perfect for social media posts', category: 'social',
        tags: ['social', 'post', 'image'], thumbnailUrl: '/thumbnails/social-template.jpg', previewUrl: '/previews/social-template.jpg',
        downloadUrl: '/downloads/social-template.zip', fileSize: 2.5,
        fileType: 'zip', createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), createdBy: 'user-1',
        isPublic: true, usageCount: 150, ratings: 4.5, licenseType: 'free'},
      {id: 'template-2', name: 'Video Intro Template',
        description: 'Professional video intro template', category: 'video',
        tags: ['video', 'intro', 'motion'], thumbnailUrl: '/thumbnails/video-intro.jpg', previewUrl: '/previews/video-intro.mp4',
        downloadUrl: '/downloads/video-intro.zip', fileSize: 15.2,
        fileType: 'zip', createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), createdBy: 'user-2',
        isPublic: true, usageCount: 89, ratings: 4.8, licenseType: 'premium'}
    ];
  },

  async getTemplateById(templateId: string): Promise<MediaTemplate | null> {
    // In a real app, this would call the backend API
    const templates = await mediaTemplateService.getAllTemplates();
    return templates.find(t => t.id === templateId) || null;
  },

  async createTemplate(templateData: Omit<MediaTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'usageCount' | 'ratings'>): Promise<MediaTemplate> {
    // In a real app, this would call the backend API
    const newTemplate: MediaTemplate = {id: `template-${Date.now()}`,
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      tags: templateData.tags,
      thumbnailUrl: templateData.thumbnailUrl,
      previewUrl: templateData.previewUrl,
      downloadUrl: templateData.downloadUrl || '/default-download-url',
      fileSize: templateData.fileSize || 1.0,
      fileType: templateData.fileType || 'jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      isPublic: templateData.isPublic ?? false,
      usageCount: 0, ratings: 0,
      licenseType: templateData.licenseType || 'free'
    };

    return newTemplate;
  },

  async updateTemplate(templateId: string, templateData: Partial<MediaTemplate>): Promise<MediaTemplate | null> {
    // In a real app, this would call the backend API
    const template = await mediaTemplateService.getTemplateById(templateId);
    if (!template) return null;

    const updatedTemplate: MediaTemplate = {
      ...template,
      ...templateData,
      updatedAt: new Date().toISOString()
    };

    return updatedTemplate;
  },

  async deleteTemplate(templateId: string): Promise<boolean> {
    // In a real app, this would call the backend API
    console.info(`Deleting, template: ${templateId}`);
    return true;
  },

  async searchTemplates(query: string, filters?: { category?: string; tags?: string[] }): Promise<MediaTemplate[]> {
    // In a real app, this would call the backend API
    let templates = await mediaTemplateService.getAllTemplates();

    if (query) {
      templates = templates.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()));
    }

    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }

    if (filters?.tags) {
      templates = templates.filter(t => filters.tags?.every(tag => t.tags.includes(tag)));
    }

    return templates;
  },

  async incrementUsage(templateId: string): Promise<boolean> {
    // In a real app, this would call the backend API
    console.info(`Incrementing usage for, template: ${templateId}`);
    return true;
  }
};

export default mediaTemplateService;
