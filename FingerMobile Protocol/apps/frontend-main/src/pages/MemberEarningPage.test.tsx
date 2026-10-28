import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberEarningPage from './MemberEarningPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 250.5
  })
}));

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

describe('MemberEarningPage Component', () => {
  it('renders Creator Earnings Dashboard heading and summary cards', () => {
    render(
      <BrowserRouter>
        <MemberEarningPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Creator Earnings Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Earnings/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MemberEarningPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Member Earning Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    const servicesBtn = within(nav).getByRole('button', { name: /^Services$/i });
    const analyticsBtn = within(nav).getByRole('button', { name: /^Analytics$/i });
    const walletBtn = within(nav).getByRole('button', { name: /^Wallet$/i });

    expect(servicesBtn).toBeInTheDocument();
    expect(analyticsBtn).toBeInTheDocument();
    expect(walletBtn).toBeInTheDocument();

    fireEvent.click(analyticsBtn);
  });
});
