// Mock API service for testing purposes
// In a real application, this would be replaced with actual API calls

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'in-stock' | 'out-of-stock' | 'low-stock';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'User',
    status: 'pending',
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'Moderator',
    status: 'inactive',
    createdAt: '2023-01-05'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    role: 'User',
    status: 'active',
    createdAt: '2023-04-12'
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    price: 199.99,
    category: 'Electronics',
    stock: 25,
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    price: 49.99,
    category: 'Electronics',
    stock: 0,
    status: 'out-of-stock'
  },
  {
    id: '3',
    name: 'Bluetooth Speaker',
    price: 89.99,
    category: 'Electronics',
    stock: 5,
    status: 'low-stock'
  },
  {
    id: '4',
    name: 'Office Chair',
    price: 149.99,
    category: 'Furniture',
    stock: 12,
    status: 'in-stock'
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 29.99,
    category: 'Furniture',
    stock: 8,
    status: 'in-stock'
  }
];

export const mockApi = {
  // Users API
  getUsers: async (): Promise<User[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  },

  getUserById: async (id: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newUser: User = {
      ...userData,
      id: (mockUsers.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  },

  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    mockUsers.splice(userIndex, 1);
  },

  // Products API
  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  getProductById: async (id: string): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newProduct: Product = {
      ...productData,
      id: (mockProducts.length + 1).toString()
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
    return mockProducts[productIndex];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    mockProducts.splice(productIndex, 1);
  }
};