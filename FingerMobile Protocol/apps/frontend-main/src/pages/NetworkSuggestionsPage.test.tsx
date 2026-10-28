import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NetworkSuggestionsPage from './NetworkSuggestionsPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('NetworkSuggestionsPage', () => {
  it('renders the title and initial recommendations', () => {
    render(
      <BrowserRouter>
        <NetworkSuggestionsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Connections & Recommendations/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dr. Amina Bello/i)[0]).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and switches category', () => {
    render(
      <BrowserRouter>
        <NetworkSuggestionsPage />
      </BrowserRouter>
    );

    const techBtn = screen.getByRole('button', { name: /Tech/i });
    expect(techBtn).toBeInTheDocument();
    fireEvent.click(techBtn);

    // Dr. Amina Bello is engineering
    expect(screen.getAllByText(/Dr. Amina Bello/i)[0]).toBeInTheDocument();
  });
});
