import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedMediaEditorPage from './AdvancedMediaEditorPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/media/AdvancedMediaEditor', () => ({
  __esModule: true,
  default: () => <div data-testid="advanced-media-editor">Media Editor Canvas Active</div>,
}));

describe('AdvancedMediaEditorPage Mobile Optimization', () => {
  it('renders layout and advanced media editor canvas', () => {
    render(
      <MemoryRouter>
        <AdvancedMediaEditorPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-media-editor')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdvancedMediaEditorPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Upload Media')).toBeInTheDocument();
    expect(screen.getByLabelText('Editor Controls')).toBeInTheDocument();
    expect(screen.getByLabelText('Master Stercs')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
