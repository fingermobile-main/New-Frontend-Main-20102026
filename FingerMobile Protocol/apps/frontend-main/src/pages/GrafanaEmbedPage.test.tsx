import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GrafanaEmbedPage from './GrafanaEmbedPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

describe('GrafanaEmbedPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGrafanaEmbedPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GrafanaEmbedPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Grafana dashboard header and controls', () => {
    renderGrafanaEmbedPage();

    expect(screen.getByRole('heading', { name: /Grafana Dashboards/i })).toBeInTheDocument();
    expect(screen.getByText(/About Grafana Integration/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with dashboard switches', () => {
    renderGrafanaEmbedPage();

    const mobileDock = screen.getByLabelText(/Grafana Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const overviewBtn = screen.getByRole('button', { name: /^Overview$/i });
    const systemBtn = screen.getByRole('button', { name: /^System$/i });
    const databaseBtn = screen.getByRole('button', { name: /^Database$/i });
    const businessBtn = screen.getByRole('button', { name: /^Business$/i });

    expect(overviewBtn).toBeInTheDocument();
    expect(systemBtn).toBeInTheDocument();
    expect(databaseBtn).toBeInTheDocument();
    expect(businessBtn).toBeInTheDocument();

    // Click System
    fireEvent.click(systemBtn);
    expect(systemBtn.className).toContain('text-purple-600');

    // Click Database
    fireEvent.click(databaseBtn);
    expect(databaseBtn.className).toContain('text-purple-600');
  });
});

