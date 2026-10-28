import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MiiAvatarPage from './MiiAvatarPage';

jest.mock('../components/ui/Select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>
}));

jest.mock('../components/ui/Slider', () => ({
  Slider: ({ value, onValueChange, ...props }: any) => (
    <input
      type="range"
      value={value ? value[0] : 0}
      onChange={(e) => onValueChange && onValueChange([Number(e.target.value)])}
      {...props}
    />
  )
}));

jest.mock('../components/ui/Tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button type="button" data-tab={value}>{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>
}));

jest.mock('../components/ui/ScrollArea', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: null,
    showToast: jest.fn()
  })
}));

describe('MiiAvatarPage Component', () => {
  it('renders unauthenticated state when user is not logged in', () => {
    render(
      <BrowserRouter>
        <MiiAvatarPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/User not authenticated/i)).toBeInTheDocument();
  });
});
