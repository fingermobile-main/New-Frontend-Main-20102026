import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 500,
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({ success: true, data: [] }),
    post: jest.fn().mockResolvedValue({ success: true, data: {} }),
  }
}));

jest.mock('../components/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);

jest.mock('../components/modals/FingerMobileVideoPlayerModal', () => ({
  FingerMobileVideoPlayerModal: () => null,
}));

jest.mock('../components/modals/FingerMobileShareModal', () => ({
  FingerMobileShareModal: () => null,
}));

jest.mock('../components/modals/PhotoCreditsCommentsModal', () => ({
  PhotoCreditsCommentsModal: () => null,
}));

jest.mock('../components/modals/PhotoCreditAiQualityModal', () => ({
  PhotoCreditAiQualityModal: () => null,
}));

jest.mock('../components/modals/FullScreenMediaViewerModal', () => ({
  FullScreenMediaViewerModal: () => null,
}));

import PhotoCreditsPage from './PhotoCreditsPage';

describe('PhotoCreditsPage', () => {
  it('renders PhotoCredits sovereign banner', () => {
    render(
      <BrowserRouter>
        <PhotoCreditsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/PhotoCredits™ Sovereign Photography Licensing/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and switches tab', () => {
    render(
      <BrowserRouter>
        <PhotoCreditsPage />
      </BrowserRouter>
    );

    const giveawayBtn = screen.getByRole('button', { name: /^Giveaway$/i });
    expect(giveawayBtn).toBeInTheDocument();
    fireEvent.click(giveawayBtn);
  });
});
