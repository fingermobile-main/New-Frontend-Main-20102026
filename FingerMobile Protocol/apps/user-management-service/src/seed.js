const sequelize = require('./config/database');
const User = require('./models/User');
const crypto = require('crypto');

// Simple hash function for test credentials (in production, use bcrypt/argon2)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const testUsers = [
  {
    username: 'admin_test',
    email: 'admin@fingermobileprotocol.com',
    phone: '+2348012345678',
    passwordHash: hashPassword('Admin@123'),
    role: 'admin',
    email_verified: true,
    phone_verified: true,
    wallet_balance: 1000.00,
    isActive: true
  },
  {
    username: 'user_test',
    email: 'user@fingermobileprotocol.com',
    phone: '+2348012345679',
    passwordHash: hashPassword('User@123'),
    role: 'user',
    email_verified: true,
    phone_verified: true,
    wallet_balance: 1000.00,
    isActive: true
  },
  {
    username: 'creator_test',
    email: 'creator@fingermobileprotocol.com',
    phone: '+2348012345680',
    passwordHash: hashPassword('Creator@123'),
    role: 'creator',
    email_verified: true,
    phone_verified: true,
    wallet_balance: 1000.00,
    isActive: true
  },
  {
    username: 'merchant_test',
    email: 'merchant@fingermobileprotocol.com',
    phone: '+2348012345681',
    passwordHash: hashPassword('Merchant@123'),
    role: 'merchant',
    email_verified: true,
    phone_verified: true,
    wallet_balance: 1000.00,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Syncing models...');
    // Use alter to ensure new columns are added safely
    await sequelize.sync({ alter: true });
    
    console.log('Clearing existing users for seed...');
    await User.destroy({ where: {} });
    
    console.log('Seeding test users...');
    for (const userData of testUsers) {
      await User.create(userData);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
