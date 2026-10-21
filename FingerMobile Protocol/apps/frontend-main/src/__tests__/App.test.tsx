import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

jest.mock('../components/GlobalProviders', () => ({
  GlobalProviders: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../components/common/UniversalSearchModal', () => () => null);
jest.mock('../components/shared/VoiceLineReactionOverlay', () => ({
  VoiceLineReactionOverlay: () => null,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  RouterProvider: () => <div>Routes</div>,
}));

describe('App', () => {
  it('renders the platform search entry point and router', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Search \(Cmd\+K\)/ })).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
  });
});
