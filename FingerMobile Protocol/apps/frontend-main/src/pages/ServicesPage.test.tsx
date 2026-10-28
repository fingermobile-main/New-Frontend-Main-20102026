import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  apiService: {
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import ServicesPage from './ServicesPage';

describe('ServicesPage', () => {
  it('renders our services header and service cards', () => {
    render(
      <BrowserRouter>
        <ServicesPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Services Marketplace/i })).toBeInTheDocument();
    expect(screen.getByText(/Custom software development for your specific requirements/i)).toBeInTheDocument();
  });

  it('selects service via mobile quick dock buttons', () => {
    render(
      <BrowserRouter>
        <ServicesPage />
      </BrowserRouter>
    );

    const consultBtns = screen.getAllByRole('button', { name: /Consult|Consulting/i });
    expect(consultBtns.length).toBeGreaterThan(0);
    fireEvent.click(consultBtns[0]);

    const devBtns = screen.getAllByRole('button', { name: /Dev|Development/i });
    expect(devBtns.length).toBeGreaterThan(0);
    fireEvent.click(devBtns[0]);
  });
});
