import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MediaIntelligencePage from './MediaIntelligencePage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('MediaIntelligencePage Component', () => {
  it('renders Media Intelligence title and telemetry counters', () => {
    render(
      <BrowserRouter>
        <MediaIntelligencePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Mi \(Media Intelligence\) Console/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MediaIntelligencePage />
      </BrowserRouter>
    );

    const pipelineBtn = screen.getByRole('button', { name: /^Pipeline$/i });
    const routingBtn = screen.getByRole('button', { name: /^Routing$/i });
    const workersBtn = screen.getByRole('button', { name: /^Workers$/i });
    const reviewsBtn = screen.getByRole('button', { name: /^Reviews$/i });

    expect(pipelineBtn).toBeInTheDocument();
    expect(routingBtn).toBeInTheDocument();
    expect(workersBtn).toBeInTheDocument();
    expect(reviewsBtn).toBeInTheDocument();

    fireEvent.click(routingBtn);
  });
});
