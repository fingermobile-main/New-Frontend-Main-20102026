const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5434,
  database: process.env.DB_NAME || 'fingermobile_platform_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

async function setupTestUsers() {
  try {
    const testUsers = [
      {
        email: 'test@fingermobile.com',
        password: process.env.TEST_USER_PASSWORD || 'TestPass123!', // ⚠️ SECURITY: Use env var in production
        membername: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      },
      {
        email: 'business1@fingermobile.com',
        password: process.env.TEST_BUSINESS_PASSWORD || 'Business123!', // ⚠️ SECURITY: Use env var in production
        membername: 'bizowner1',
        firstName: 'Sarah',
        lastName: 'Johnson'
      },
      {
        email: 'creator1@fingermobile.com',
        password: process.env.TEST_CREATOR_PASSWORD || 'Creator123!', // ⚠️ SECURITY: Use env var in production
        membername: 'contentcreator',
        firstName: 'Mike',
        lastName: 'Chen'
      },
      {
        email: 'investor1@fingermobile.com',
        password: process.env.TEST_INVESTOR_PASSWORD || 'Invest123!', // ⚠️ SECURITY: Use env var in production
        membername: 'angelinvestor',
        firstName: 'Lisa',
        lastName: 'Martinez'
      }
    ];

    console.log('========================================');
    console.log('Setting up Test Users');
    console.log('========================================\n');

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      
      // Insert or update member
      await pool.query(`
        INSERT INTO members (membername, email, password_hash, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (email) DO UPDATE SET password_hash = $3
      `, [user.membername, user.email, passwordHash, user.firstName, user.lastName]);
      
      // Ensure wallet exists with initial balance
      await pool.query(`
        INSERT INTO fics_wallets (member_id, balance)
        SELECT id, 1000.00 FROM members WHERE email = $1
        ON CONFLICT (member_id) DO NOTHING
      `, [user.email]);
      
      console.log(`✅ ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Username: ${user.membername}\n`);
    }
    
    console.log('========================================');
    console.log('✅ All test users created/updated successfully!');
    console.log('========================================');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupTestUsers();
