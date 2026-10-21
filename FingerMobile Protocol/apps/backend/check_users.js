const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  try {
    // Create connection to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_platform'
    });

    // Query to get all users
    const [rows] = await connection.execute('SELECT * FROM Users');

    console.log(`Found ${rows.length} users:`);
    console.log('ID\tUsername\t\tEmail\t\tCreated At');
    console.log('-'.repeat(80));

    for (const user of rows) {
      console.log(`${user.id}\t${user.username}\t\t${user.email}\t\t${user.createdAt}`);
    }

    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

// Run the function
checkUsers();
