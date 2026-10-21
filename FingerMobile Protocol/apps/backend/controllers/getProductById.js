const logger = require('../utils/logger');
const { Pool } = require('pg');

// Assuming the pool is configured similarly to other controllers
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'fingermobile_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

/**
 * Controller to fetch a product by its ID, including its variants.
 * @param {*} req - Express request object containing the product ID in params.
 * @param {*} res - Express response object.
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  // Validate UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return res.status(400).json({ error: 'Invalid product ID format.' });
  }

  const client = await pool.connect();

  try {
    // Query product details
    const productQuery = `
      SELECT id, name, description, base_price AS price, category_id, store_id, seller_id, brand, weight, dimensions, shipping_methods, spec_json, status, is_featured, created_at, updated_at
      FROM products 
      WHERE id = $1 AND is_active = TRUE
    `;
    const productResult = await client.query(productQuery, [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = productResult.rows[0];

    // Query associated variants
    const variantsQuery = `
      SELECT id, name, sku, ean, price, stock_quantity AS stock, reserved_stock, attributes, images, is_active, created_at, updated_at
      FROM product_variants 
      WHERE product_id = $1 AND is_active = TRUE
      ORDER BY created_at ASC
    `;
    const variantsResult = await client.query(variantsQuery, [id]);

    // Attach variants to the product object
    product.variants = variantsResult.rows;

    // Enhance with reviews
    try {
      const reviewResult = await client.query('SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as review_count FROM product_reviews WHERE product_id = $1', [id]);
      product.reviews = {
        averageRating: parseFloat(reviewResult.rows[0].average_rating).toFixed(1),
        reviewCount: parseInt(reviewResult.rows[0].review_count, 10)
      };
    } catch (e) {
      logger.warn('Failed to fetch reviews (table may not exist):', e.message);
      product.reviews = { averageRating: '0.0', reviewCount: 0 };
    }

    res.json(product);
  } catch (error) {
    logger.error('Database error in getProductById:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
};

module.exports = { getProductById };
