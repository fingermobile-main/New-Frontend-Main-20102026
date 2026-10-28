import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobsPage from './JobsPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../services/jobsService', () => ({
  jobsService: {
    getJobs: jest.fn().mockResolvedValue({
      jobs: [
        {
          id: 'job_1',
          title: 'Senior Protocol Engineer',
          company: 'FingerMobile Core',
          location: 'Remote',
          type: 'Full-time',
          category: 'Engineering',
          salaryRange: '$120,000 - $160,000',
          description: 'Build decentralized peer living rooms',
          requirements: 'TypeScript, React, Rust, WebRTC'
        }
      ]
    }),
    createJob: jest.fn().mockResolvedValue({ success: true }),
    applyForJob: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('JobsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderJobsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <JobsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Jobs & Careers header banner', async () => {
    renderJobsPage();

    expect(await screen.findByText(/Discover Verified Tech & NYSC Career Roles/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderJobsPage();

    const mobileDock = await screen.findByLabelText(/Jobs Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const allJobsBtn = within(mobileDock).getByRole('button', { name: /^All Jobs$/i });
    const techBtn = within(mobileDock).getByRole('button', { name: /^Tech$/i });
    const remoteBtn = within(mobileDock).getByRole('button', { name: /^Remote$/i });
    const postJobBtn = within(mobileDock).getByRole('button', { name: /^Post Job$/i });

    expect(allJobsBtn).toBeInTheDocument();
    expect(techBtn).toBeInTheDocument();
    expect(remoteBtn).toBeInTheDocument();
    expect(postJobBtn).toBeInTheDocument();

    // Click Post Job
    fireEvent.click(postJobBtn);
    expect(await screen.findByRole('heading', { name: /^Post New Job Vacancy$/i })).toBeInTheDocument();
  });
});
