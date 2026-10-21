import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersPage from '../pages/UsersPage';
import { AuthProvider } from '../contexts/AuthContext';
import { mockApi, type User } from '../services/mockApi';

// Mock the mockApi module
jest.mock('../services/mockApi', () => ({
  ...jest.requireActual('../services/mockApi'),
  mockApi: {
    getUsers: jest.fn()
  }
}));

const mockedMockApi = mockApi as jest.Mocked<typeof mockApi>;

// Mock wrapper component to provide auth context
const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockedMockApi.getUsers.mockImplementation(() => {
      return new Promise(() => {}); // Never resolving promise to simulate loading
    });

    render(<UsersPage />, { wrapper: MockWrapper });

    expect(screen.getByText('Users Management')).toBeInTheDocument();
  });

  it('displays users when data is loaded', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'active',
        createdAt: '2023-01-15'
      }
    ];

    mockedMockApi.getUsers.mockResolvedValue(mockUsers);

    render(<UsersPage />, { wrapper: MockWrapper });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows error message when data fetching fails', async () => {
    const errorMessage = 'Failed to fetch users';
    mockedMockApi.getUsers.mockRejectedValue(new Error(errorMessage));

    render(<UsersPage />, { wrapper: MockWrapper });

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
    });
  });
});