import React, {} from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import CommentSection from './CommentSection';

describe('CommentSection', () => {
  it('renders comments', () => {
    const mockComments: any[] = [];
    render(<CommentSection comments={mockComments} />);
    expect(screen.queryByText(/comments/i)).toBeTruthy();
  });
});