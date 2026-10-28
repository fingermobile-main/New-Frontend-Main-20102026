import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FingerMobileEditorStudioPage from './FingerMobileEditorStudioPage';

jest.mock('../../components/editor/FingerMobileEditorStudio', () => {
  return function MockFingerMobileEditorStudio() {
    return <div data-testid="fingermobile-editor-studio" />;
  };
});

jest.mock('../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card" />,
}));

describe('FingerMobileEditorStudioPage', () => {
  it('renders fingermobile editor studio canvas and mobile dock', () => {
    render(
      <MemoryRouter>
        <FingerMobileEditorStudioPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/FingerMobile Protocol - Editor Studio/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Clearance/i }).length).toBeGreaterThan(0);
  });
});
