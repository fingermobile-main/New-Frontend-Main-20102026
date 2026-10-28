import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuardianAiPage from './GuardianAiPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/stats')) {
        return Promise.resolve({
          data: {
            totalSystems: 12,
            activeSystems: 10,
            totalEvents: 140,
            criticalEvents: 3,
            systemHealth: 98.4
          }
        });
      }
      return Promise.resolve({
        data: [
          {
            id: 1,
            name: 'Seeker Guard Alpha',
            description: 'Autonomous neural security cluster',
            category: 'detection',
            status: 'active',
            priority: 'high',
            confidenceThreshold: 90,
            autoResponse: true,
            createdAt: '2026-01-01',
            updatedAt: '2026-01-02',
            lastTrained: '2026-01-03',
            trainingDataSize: 1000,
            modelType: 'transformer',
            parameters: {}
          }
        ]
      });
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    put: jest.fn().mockResolvedValue({ data: { success: true } }),
    delete: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

describe('GuardianAiPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGuardianAiPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GuardianAiPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Guardian AI management console header', async () => {
    renderGuardianAiPage();

    expect(await screen.findByRole('heading', { name: /Guardian AI Management/i })).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderGuardianAiPage();

    const mobileDock = await screen.findByLabelText(/Guardian AI Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const systemsBtn = within(mobileDock).getByRole('button', { name: /^Systems$/i });
    const eventsBtn = within(mobileDock).getByRole('button', { name: /^Events$/i });
    const actionsBtn = within(mobileDock).getByRole('button', { name: /^Actions$/i });
    const metricsBtn = within(mobileDock).getByRole('button', { name: /^Metrics$/i });

    expect(systemsBtn).toBeInTheDocument();
    expect(eventsBtn).toBeInTheDocument();
    expect(actionsBtn).toBeInTheDocument();
    expect(metricsBtn).toBeInTheDocument();

    // Click Events
    fireEvent.click(eventsBtn);
    expect(eventsBtn.className).toContain('text-blue-600');

    // Click Actions
    fireEvent.click(actionsBtn);
    expect(actionsBtn.className).toContain('text-blue-600');
  });
});
