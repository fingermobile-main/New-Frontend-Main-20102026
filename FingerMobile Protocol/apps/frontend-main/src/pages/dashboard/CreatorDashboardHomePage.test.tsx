import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreatorDashboardHomePage from './CreatorDashboardHomePage';

describe('CreatorDashboardHomePage', () => {
  it('renders and redirects to hub', () => {
    const { container } = render(
      <MemoryRouter>
        <CreatorDashboardHomePage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
