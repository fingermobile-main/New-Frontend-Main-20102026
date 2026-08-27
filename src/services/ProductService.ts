import apiService from './apiService';
import { Product } from '../types';

const ProductService = {
  /**
   * Fetches a product by its ID, including its variants.
   * @param productId The unique identifier of the product.
   * @returns A promise resolving to the Product object.
   */
  getProductById: async (productId: string): Promise<Product> => {
    try {
      const response = await apiService.get(`/products/${productId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product with id ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches a list of products based on filters.
   * @param filters Optional query parameters for filtering.
   * @returns A promise resolving to an array of Product objects.
   */
  getProducts: async (filters?: Record<string, unknown>): Promise<Product[]> => {
    try {
      const response = await apiService.get('/products', filters);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Other methods like createProduct, updateProduct, etc. can be added here.
};

export default ProductService;