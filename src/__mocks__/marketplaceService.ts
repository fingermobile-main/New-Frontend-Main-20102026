import { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description:
      'High-quality wireless headphones with noise cancellation and long battery life.',
    price: 99.99,
    currency: 'USD',
    images: [
      'https://placehold.co/300x300?text=Headphones'
    ],
    category: 'Electronics',
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: 'https://placehold.co/300x300?text=Headphones',
    reviewCount: 120,
    rating: 4.5,
    seller: {
      id: 'seller1',
      name: 'ElectroMart'
    }
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    description:
      'Monitor your heart rate, steps, and sleep with this advanced fitness tracker.',
    price: 49.99,
    currency: 'USD',
    images: [
      'https://placehold.co/300x300?text=Fitness+Tracker'
    ],
    category: 'Electronics',
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: 'https://placehold.co/300x300?text=Fitness+Tracker',
    reviewCount: 89,
    rating: 4.2,
    seller: {
      id: 'seller2',
      name: 'FitGear'
    }
  }
];

const mockCategories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'books', name: 'Books' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' }
];

const mockReviews = [
  {
    id: 'review1',
    productId: '1',
    userId: 'user1',
    rating: 5,
    comment: 'Excellent sound quality and comfortable to wear.',
    date: new Date().toISOString()
  },
  {
    id: 'review2',
    productId: '1',
    userId: 'user2',
    rating: 4,
    comment: 'Good headphones but a bit expensive.',
    date: new Date().toISOString()
  }
];

export { mockProducts, mockCategories, mockReviews };
