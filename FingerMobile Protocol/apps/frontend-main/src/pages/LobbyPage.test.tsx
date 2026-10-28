import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LobbyPage from './LobbyPage';
import { AppProvider } from '../contexts/AppContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('LobbyPage Component & Sovereign Mobile Quick Dock', () => {
  const renderLobbyPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <LobbyPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Live Lobby heading and form inputs', () => {
    renderLobbyPage();

    expect(screen.getByRole('heading', { name: /Live Lobby/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter 6-character code/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', () => {
    renderLobbyPage();

    const mobileDock = screen.getByLabelText(/Lobby Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const joinBtn = within(mobileDock).getByRole('button', { name: /^Join$/i });
    const hostBtn = within(mobileDock).getByRole('button', { name: /^Host$/i });
    const streamsBtn = within(mobileDock).getByRole('button', { name: /^Streams$/i });
    const homeBtn = within(mobileDock).getByRole('button', { name: /^Home$/i });

    expect(joinBtn).toBeInTheDocument();
    expect(hostBtn).toBeInTheDocument();
    expect(streamsBtn).toBeInTheDocument();
    expect(homeBtn).toBeInTheDocument();

    // Click Streams
    fireEvent.click(streamsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/live-streaming');

    // Click Home
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

