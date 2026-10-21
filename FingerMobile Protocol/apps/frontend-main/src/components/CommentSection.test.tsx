import React, {} from 'react';
import { render, screen } from '@testing-library/react';
// Jest globals are provided by react-scripts.

import CommentSection from './CommentSection';

describe('CommentSection', () => {
  it('renders comments', () => {
    const mockComments: any[] = [];
    render(<CommentSection comments={mockComments} />);
    expect(screen.queryByText(/comments/i)).toBeTruthy();
  });
});
