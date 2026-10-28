import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditorStudioPage from './EditorStudioPage';

jest.mock('../../components/editor/EnhancedEditorStudio', () => {
  return function MockEnhancedEditorStudio() {
    return <div data-testid="enhanced-editor-studio" />;
  };
});

jest.mock('../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card" />,
}));

describe('EditorStudioPage', () => {
  it('renders editor studio canvas and mobile dock', () => {
    render(
      <MemoryRouter>
        <EditorStudioPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/FingerMobile Protocol - Editor Studio/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Clearance/i }).length).toBeGreaterThan(0);
  });
});
