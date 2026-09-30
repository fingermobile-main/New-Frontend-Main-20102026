import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoTranslationDashboard from './VideoTranslationDashboard';

describe('VideoTranslationDashboard', () => {
  it('renders studio header and language pair controls', () => {
    render(<VideoTranslationDashboard />);

    expect(screen.getByText(/AI Video Translation & Dubbing Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/Language Routing/i)).toBeInTheDocument();
    expect(screen.getByText(/Neural Voice Dubbing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export \.VTT/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export \.SRT/i })).toBeInTheDocument();
  });

  it('renders subtitle cue matrix and permits editing translated cue', () => {
    render(<VideoTranslationDashboard />);

    expect(screen.getByText(/Synchronized Subtitle Cue Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the FingerMobile decentralized content economy/i)).toBeInTheDocument();

    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBeGreaterThan(0);
    fireEvent.change(textareas[0], {
      target: { value: 'Bienvenue dans la nouvelle économie décentralisée.' }
    });
    expect((textareas[0] as HTMLTextAreaElement).value).toBe(
      'Bienvenue dans la nouvelle économie décentralisée.'
    );
  });
});
