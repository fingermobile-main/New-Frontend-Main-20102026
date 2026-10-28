import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LmsPage from './LmsPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../components/PageHeader', () => ({
  __esModule: true,
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}));

jest.mock('../services/elearningService', () => ({
  elearningService: {
    getMyEnrolledCourses: jest.fn().mockResolvedValue([
      {
        id: 1,
        title: 'Decentralized Peer Network Architecture',
        instructor_name: 'Prof. Sovereign',
        progress: 75,
        enrolled_at: '2026-02-15',
        thumbnail_url: 'https://example.com/thumb.jpg',
        category: 'Engineering',
        rating_average: 4.9,
        duration_hours: 12
      }
    ])
  }
}));

describe('LmsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderLmsPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <LmsPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the LMS header and summary stats', async () => {
    renderLmsPage();

    expect(await screen.findByRole('heading', { name: /Learning Management System/i })).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderLmsPage();

    const mobileDock = await screen.findByLabelText(/LMS Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const coursesBtn = within(mobileDock).getByRole('button', { name: /^Courses$/i });
    const tasksBtn = within(mobileDock).getByRole('button', { name: /^Tasks$/i });
    const liveBtn = within(mobileDock).getByRole('button', { name: /^Live$/i });
    const catalogBtn = within(mobileDock).getByRole('button', { name: /^Catalog$/i });

    expect(coursesBtn).toBeInTheDocument();
    expect(tasksBtn).toBeInTheDocument();
    expect(liveBtn).toBeInTheDocument();
    expect(catalogBtn).toBeInTheDocument();

    // Click Catalog
    fireEvent.click(catalogBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/elearning');
  });
});

