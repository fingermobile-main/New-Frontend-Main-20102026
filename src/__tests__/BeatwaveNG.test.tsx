import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import BeatwaveNGDemoPage from '../pages/BeatwaveNGDemoPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({ showToast: jest.fn() }),
}));

describe('BeatwaveNGDemoPage', () => {
  it('renders the current high-fidelity studio page', () => {
    render(<MemoryRouter><BeatwaveNGDemoPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { level: 1, name: 'BeatwaveNG High-Fidelity Studio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Launch BeatwaveNG Console' })).toBeInTheDocument();
  });
});
