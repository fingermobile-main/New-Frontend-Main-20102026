const fs = require('fs');
const path = require('path');

// Fixed UUIDs to mock seller IDs
const sellerId1 = 'e1a3b4c1-6b8f-4d9a-9e8b-1f2a3b4c5d6e';
const sellerId2 = 'f2b4c5d2-7c9g-5e0b-0f9c-2g3b4c5d6e7f';

const generateMarketplaceCSV = () => {
  const headers = ['sku', 'name', 'description', 'price', 'stock', 'category', 'seller_id'];
  const data = [
    ['SKU001', 'Smartphone X', 'Latest smartphone with high-res camera', '999.99', '50', 'Electronics', sellerId1],
    ['SKU002', 'Wireless Earbuds', 'Noise-cancelling wireless earbuds', '199.99', '200', 'Electronics', sellerId1],
    ['SKU003', 'Ergonomic Office Chair', 'Comfortable chair for long hours', '249.50', '20', 'Furniture', sellerId2],
    ['LND001', 'Loansqr Starter Loan', 'Personal loan for quick cash needs', '500.00', '1000', 'Financial', sellerId2],
    ['LND002', 'Loansqr SME Business Loan', 'Small business expansion loan', '5000.00', '500', 'Financial', sellerId1]
  ];

  const csvContent = [headers.join(','), ...data.map(row => row.map(item => `"${item}"`).join(','))].join('\n');

  const outputPath = path.join(__dirname, 'marketplace_products_batch_1.csv');
  fs.writeFileSync(outputPath, csvContent);
};

generateMarketplaceCSV();
