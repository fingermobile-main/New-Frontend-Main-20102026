import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StercsEditorPage from './StercsEditorPage';

describe('StercsEditorPage', () => {
  it('renders STERCS Command Bank DSL Studio and command snippets', () => {
    render(<StercsEditorPage />);

    expect(screen.getByText(/STERCS Command Bank DSL Studio/i)).toBeInTheDocument();
    expect(screen.getByText('Glitch Whip Pan')).toBeInTheDocument();
    expect(screen.getByText('Bass Drop Impact')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Lottie Gold Badge')).toBeInTheDocument();
  });

  it('allows inserting snippets into the DSL script editor', () => {
    render(<StercsEditorPage />);

    const insertBtns = screen.getAllByRole('button', { name: /\+ Insert/i });
    expect(insertBtns.length).toBeGreaterThan(0);
    fireEvent.click(insertBtns[0]);

    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toContain('TRANSITION glitch');
  });

  it('renders simulated timeline scrubber and play preview controls', () => {
    render(<StercsEditorPage />);

    expect(screen.getByText(/Simulation Viewport/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Preview/i })).toBeInTheDocument();
  });
});
