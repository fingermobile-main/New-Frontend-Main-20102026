import { render, screen } from '@testing-library/react';
import MinimalPostCard from './PostCard'; // Fixed import path: MinimalPostCard.test.tsx -> PostCard.tsx
import { Post } from '../types'; // Assuming Post type is defined here

describe('MinimalPostCard', () => {
  it('renders correctly', () => {
    // Create a minimal mock post object
    const mockPost: Post = {
      id: 'test-id',
      title: 'Test Post',
      content: 'This is test content.',
      author: { id: 'author-id', name: 'Author Name' },
      createdAt: new Date().toISOString(),
      // Add other required fields as per the Post type definition
    };
    // Render the component with the mock post
    render(<MinimalPostCard post={mockPost} />);
    expect(screen.getByText(/test post/i)).toBeInTheDocument();
  });
});