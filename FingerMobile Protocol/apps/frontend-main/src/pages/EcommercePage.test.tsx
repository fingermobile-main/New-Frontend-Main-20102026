import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EcommercePage from './EcommercePage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('EcommercePage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and sovereign mobile navigation dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <EcommercePage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/E-commerce Management/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Ecommerce Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const productsBtn = within(nav).getByRole('button', { name: /^Products$/i });
    const ordersBtn = within(nav).getByRole('button', { name: /^Orders$/i });
    const inventoryBtn = within(nav).getByRole('button', { name: /^Inventory$/i });
    const addBtn = within(nav).getByRole('button', { name: /^Add$/i });

    expect(productsBtn).toBeInTheDocument();
    expect(ordersBtn).toBeInTheDocument();
    expect(inventoryBtn).toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(ordersBtn);
    fireEvent.click(inventoryBtn);
    fireEvent.click(productsBtn);
    fireEvent.click(addBtn);

    // Ensure modal appears
    expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
  });
});
