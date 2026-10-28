import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogsManagement from './BlogsManagement';

describe('BlogsManagement Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    delete (window as any).location;
    window.location = { assign: jest.fn() } as any;
  });

  test('renders Blogs Management, list items and quick dock', () => {
    render(<BlogsManagement userId="user-1" />);

    expect(screen.getByText('Blog Management')).toBeInTheDocument();
    expect(screen.getByText(/Publish, edit, and curate platform stories/i)).toBeInTheDocument();
    expect(screen.getByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript Tips')).toBeInTheDocument();

    // Test filter quick dock actions
    const publishedBtn = screen.getByRole('button', { name: /Show Published/i });
    fireEvent.click(publishedBtn);
    expect(screen.getByText('Getting Started with React')).toBeInTheDocument();
    expect(screen.queryByText('Advanced TypeScript Tips')).not.toBeInTheDocument();

    const draftsBtn = screen.getByRole('button', { name: /Show Drafts/i });
    fireEvent.click(draftsBtn);
    expect(screen.getByText('Advanced TypeScript Tips')).toBeInTheDocument();
    expect(screen.queryByText('Getting Started with React')).not.toBeInTheDocument();

    const allBtn = screen.getByRole('button', { name: /Show All Posts/i });
    fireEvent.click(allBtn);
    expect(screen.getByText('Getting Started with React')).toBeInTheDocument();

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('navigates to create blog on new post button', () => {
    render(<BlogsManagement userId="user-1" />);

    const quickNewBtn = screen.getByRole('button', { name: /Quick New Post/i });
    fireEvent.click(quickNewBtn);
    expect(window.location.assign).toHaveBeenCalledWith('/blog/create');
  });
});

