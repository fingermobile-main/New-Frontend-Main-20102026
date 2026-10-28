import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditorPage from './EditorPage';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 2500,
  }),
}));

// Mock react-dnd HTML5Backend
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
}));

jest.mock('../components/editor/Canvas', () => {
  return function MockCanvas() {
    return <div data-testid="mock-canvas">Canvas Component</div>;
  };
});

jest.mock('../components/editor/PropertiesPanel', () => {
  return function MockPropertiesPanel() {
    return <div data-testid="mock-properties-panel">Properties Panel</div>;
  };
});

describe('EditorPage Mobile Optimization Suite', () => {
  it('renders toolbar actions with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const saveButtons = screen.getAllByRole('button', { name: /save/i });
    expect(saveButtons.length).toBeGreaterThan(0);
    saveButtons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <EditorPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /editor mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
