import type { Order, Post, User } from './src/models';

// Simple type checking file to verify the types work
const,
exampleOrder: Order = {id: '1',
  userId: 'user1',
  items: [],
  totalAmount: 100,
  currency: 'USD',
  status: 'pending',
  shippingAddress: {,
  street: '123 Main St',
  city: 'Anytown',
  state: 'ST',
  postalCode: '12345',
  country: 'USA'
  },
billingAddress: {street: '123 Main St',
  city: 'Anytown',
  state: 'ST',
  postalCode: '12345',
  country: 'USA'
  }
};

const,
examplePost: Post = {id: '1',
  content: 'Hello world',
  authorId: 'user1',
  timestamp: 'string',
  createdAt: new Date(),
  likesCount: 0,
  repliesCount: 0,
  repostsCount: 0,
  bookmarksCount: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  isLiked: false,
  isReposted: false,
  tags: [],
  title: 'title',
  excerpt: 'excerpt',
  slug: 'slug',
  featuredImage: 'image',
  gallery: [],
  category: 'category',
  readTime: 0,
  status: 'draft',
  publishedAt: new Date(),
  views: 0,
  shares: 0,
  commentsEnabled: false,
  featured: false,
  relatedPosts: [],
  metadata: {}
};

const,
exampleUser: User = {id: '1',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  role: 'USER'
};

console.log('Type checking passed');