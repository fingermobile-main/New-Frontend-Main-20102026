import React, {} from 'react';
import axios from "axios";

export interface VideoAsset {id: string;
  member_id: string;
  title: string;
  original_file_url: string;
  processed_file_url: string;
  thumbnail_url: string;
  duration: number;
  resolution: string;
  file_size: number;
  status: string;
  processing_progress: number;
  started_processing_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface VideoProject {id: string;
  member_id: string;
  title: string;
  description?: string;
  project_data: any;
  preview_thumbnail_url: string;
  export_settings: any;
  current_version: number;
  status: string;
  scheduled_publish_at: string;
  created_at: string;
  updated_at: string;
}

export interface VideoProcessingJob {id: string;
  project_id: string;
  asset_id: string;
  job_type: string;
  status: string;
  progress: number;
  input_params: any;
  output_result: any;
  started_at: string;
  completed_at: string;
  created_at: string;
}

// Upload a video
export const uploadVideo = async (
  videoFile: File,
title: string,
): Promise<VideoAsset> => {
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("title", title);

  const response = await axios.post("/video-editor/upload", formData, {headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data.videoAsset;
};

// Create a new video project
export const createVideoProject = async (
  title: string,
description?: string,
projectData: unknown,
): Promise<VideoProject> => {
  const response = await axios.post("/video-editor/projects", {
    title,
    description,
    projectData
  });
  return response.data.project;
};

// Get a video project by ID
export const getVideoProjectById = async (
  projectId: string,
): Promise<VideoProject> => {
  const response = await axios.get(`/video-editor/projects/${projectId}`);
  return response.data.project;
};

// Get all video projects for a member
export const getVideoProjects = async (): Promise<VideoProject[]> => {
  const response = await axios.get("/video-editor/projects");
  return response.data.projects;
};

// Update a video project
export const updateVideoProject = async (
  projectId: string,
projectData: unknown,
  title?: string,
  description?: string,
): Promise<VideoProject> => {
  const response = await axios.put(`/video-editor/projects/${projectId}`, {
    projectData,
    title,
    description
  });
  return response.data.project;
};

// Save project as draft
export const saveDraft = async (
  projectId: string,
projectData: unknown,
): Promise<VideoProject> => {
  const response = await axios.post(
    `/video-editor/projects/${projectId}/save-draft`,
    {
      projectData
    },
  );
  return response.data.project;
};

// Schedule a project for publishing
export const scheduleProject = async (
  projectId: string,
scheduleTime: string,
): Promise<VideoProject> => {
  const response = await axios.post(
    `/video-editor/projects/${projectId}/schedule`,
    {
      scheduleTime
    },
  );
  return response.data.project;
};

// Publish a project immediately
export const publishProject = async (
  projectId: string,
): Promise<VideoProject> => {
  const response = await axios.post(
    `/video-editor/projects/${projectId}/publish`,
  );
  return response.data.project;
};

// Delete a video project
export const deleteVideoProject = async (
  projectId: string,
): Promise<VideoProject> => {
  const response = await axios.delete(`/video-editor/projects/${projectId}`);
  return response.data.project;
};

// Create a processing job
export const createProcessingJob = async (
  projectId: string,
jobType: string,
inputParams: unknown,
): Promise<VideoProcessingJob> => {
  const response = await axios.post("/video-editor/jobs", {
    projectId,
    jobType,
    inputParams
  });
  return response.data.job;
};

// Get processing job status
export const getProcessingJobStatus = async (
  jobId: string,
): Promise<VideoProcessingJob> => {
  const response = await axios.get(`/video-editor/jobs/${jobId}`);
  return response.data.job;
};

// Get all jobs for a project
export const getJobsForProject = async (
  projectId: string,
): Promise<VideoProcessingJob[]> => {
  const response = await axios.get(`/video-editor/projects/${projectId}/jobs`);
  return response.data.jobs;
};

// Cancel a processing job
export const cancelProcessingJob = async (
  jobId: string,
): Promise<VideoProcessingJob> => {
  const response = await axios.post(`/video-editor/jobs/${jobId}/cancel`);
  return response.data.job;
};
