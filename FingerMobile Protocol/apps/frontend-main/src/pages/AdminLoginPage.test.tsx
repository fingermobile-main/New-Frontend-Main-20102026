import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage';

describe('AdminLoginPage Mobile Optimization', () => {
  it('renders admin gateway and credentials fields', async () => {
    render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Admin Gateway/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@fingermobileprotocol.com/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Home and User Login navigation', () => {
    render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /user login/i })).toBeInTheDocument();
  });
});

