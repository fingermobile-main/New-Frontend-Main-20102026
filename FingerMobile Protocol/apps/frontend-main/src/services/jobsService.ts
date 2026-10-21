import { api } from './api';

export interface JobVacancy {
  id: number | string;
  title: string;
  company: string;
  location: string;
  type: string;
  category?: string;
  salary_range?: string;
  salaryRange?: string;
  experience_level?: string;
  experienceLevel?: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  creator_id?: number;
  created_at?: string;
  hasApplied?: boolean;
}

export interface JobApplication {
  id?: number;
  job_id: number | string;
  resume_url?: string;
  resumeUrl?: string;
  cover_letter?: string;
  coverLetter?: string;
  portfolio_url?: string;
  portfolioUrl?: string;
  status?: string;
  created_at?: string;
}

export interface JobFilters {
  search?: string;
  type?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

class JobsService {
  private baseUrl = '/jobs';

  async getJobs(filters?: JobFilters): Promise<{ jobs: JobVacancy[]; total: number }> {
    try {
      const response = await api.get(this.baseUrl, { params: filters });
      const data = response.data;
      const list = data.data || data.jobs || [];
      const total = data.pagination?.total || list.length;
      return { jobs: list, total };
    } catch (error) {
      console.error('Failed to get jobs:', error);
      return { jobs: [], total: 0 };
    }
  }

  async getJobById(id: string | number): Promise<JobVacancy | null> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Failed to get job ${id}:`, error);
      return null;
    }
  }

  async createJob(jobData: Partial<JobVacancy>): Promise<JobVacancy> {
    const response = await api.post(this.baseUrl, {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type || 'Full-time',
      category: jobData.category || 'General',
      salaryRange: jobData.salary_range || jobData.salaryRange || 'Competitive',
      experienceLevel: jobData.experience_level || jobData.experienceLevel || 'Mid-Level',
      description: jobData.description,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || []
    });
    return response.data?.data;
  }

  async applyForJob(jobId: string | number, application: { resumeUrl?: string; coverLetter?: string; portfolioUrl?: string }): Promise<any> {
    const response = await api.post(`${this.baseUrl}/${jobId}/apply`, application);
    return response.data;
  }

  async getMyApplications(): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/applications/my`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to get user job applications:', error);
      return [];
    }
  }
}

export const jobsService = new JobsService();
export default jobsService;
