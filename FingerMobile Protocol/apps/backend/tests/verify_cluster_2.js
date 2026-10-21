const request = require('supertest');
const app = require('../app');

async function verifyCluster2() {
  console.log('--- Verifying Cluster 2 Endpoints ---');

  const db = require('../db');
  await db.query(`
    INSERT INTO gift_cards (code, amount, balance, status, currency, description, purchased_by, created_at)
    VALUES ('FIC-TEST-REDEEM', 100.00, 100.00, 'active', 'FIC', 'Test Card', '4', NOW())
    ON CONFLICT (code) DO UPDATE SET status = 'active'
  `);

  const tests = [
    { method: 'get', path: '/api/wallet', desc: 'Wallet Info' },
    { method: 'get', path: '/api/wallet/balance', desc: 'Wallet Balance' },
    { method: 'get', path: '/api/wallet/transactions', desc: 'Wallet Transactions' },
    {
      method: 'post',
      path: '/api/wallet/deposit',
      desc: 'Wallet Deposit',
      body: { amount: 100, payment_method: 'bank_card' }
    },
    {
      method: 'post',
      path: '/api/wallet/withdraw',
      desc: 'Wallet Withdraw',
      body: { amount: 25, withdrawal_method: 'bank_transfer', account_details: { bankName: 'Zenith Bank' } }
    },
    {
      method: 'post',
      path: '/api/wallet/transfer',
      desc: 'Wallet Transfer',
      body: { recipient_wallet_address: 'fm_wallet_mem1_005', amount: 10, note: 'Test Transfer' }
    },
    { method: 'get', path: '/api/wallet/exchange-rates', desc: 'Wallet Exchange Rates' },
    { method: 'get', path: '/api/fic-vault', desc: 'FIC Vault Status' },
    {
      method: 'post',
      path: '/api/fic-vault/deposit',
      desc: 'FIC Vault Deposit',
      body: { amount: 50, description: 'Test Vault Staking' }
    },
    {
      method: 'post',
      path: '/api/fic-vault/withdraw',
      desc: 'FIC Vault Withdraw',
      body: { amount: 20, description: 'Test Vault Unstaking' }
    },
    { method: 'get', path: '/api/fic-vault/history', desc: 'FIC Vault History' },
    { method: 'get', path: '/api/loyalty', desc: 'Loyalty Points & Rewards' },
    {
      method: 'post',
      path: '/api/loyalty/redeem',
      desc: 'Loyalty Reward Redemption',
      body: { rewardId: 'r1' }
    },
    { method: 'get', path: '/api/referrals', desc: 'Referral Dashboard Stats' },
    { method: 'get', path: '/api/billing/invoices', desc: 'Billing Invoices List' },
    { method: 'get', path: '/api/billing/payment-methods', desc: 'Billing Payment Methods' },
    { method: 'get', path: '/api/payouts', desc: 'Bank Payouts List' },
    {
      method: 'post',
      path: '/api/payouts',
      desc: 'Bank Payout Initiate',
      body: { amount: 5000, bankName: 'Access Bank', accountNumber: '0123456789' }
    },
    { method: 'get', path: '/api/giftcards', desc: 'Gift Cards List' },
    {
      method: 'post',
      path: '/api/giftcards/redeem',
      desc: 'Gift Card Redeem by Code',
      body: { code: 'FIC-TEST-REDEEM' }
    }
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      let req = request(app)[t.method](t.path);
      if (t.body) {
        req = req.send(t.body);
      }
      const res = await req;
      if (res.status === 200 || res.status === 201) {
        console.log(`✅ [${res.status}] ${t.desc} (${t.path})`);
        passed++;
      } else {
        console.error(`❌ [${res.status}] ${t.desc} (${t.path}) - Body:`, res.body || res.text);
      }
    } catch (err) {
      console.error(`❌ Error requesting ${t.path}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed}/${tests.length} endpoints operational.`);
  if (passed === tests.length) {
    console.log('🎉 All Cluster 2 endpoints are 100% operational against live PostgreSQL!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyCluster2();
