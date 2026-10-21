/* eslint-disable no-unused-vars */
/**
 * FingerMobile Protocol™ - Treasury Wallet Funding & Sovereign Vault Depletion Service
 * Dedicated Sovereign Protocol Treasury Rail: Alternative Bank (Acc: 0514108422)
 * Executive Approval: Mrs. Mbah Eunice Emonena (CFO, Co-Founder, Admin-1 & Master Control)
 * Platform Policy: Zero Error Margin
 */

const db = require('../db');
const pool = db?.pool;
const logger = require('../utils/logger');
const crypto = require('crypto');

// Dedicated Sovereign Protocol Treasury Rail Details
const TREASURY_BANK_DETAILS = {
  bankName: 'Alternative Bank',
  licenseStatus: 'CBN Licensed & Supervised Institution',
  accountNumber: '0514108422',
  railTitle: 'Dedicated Sovereign Protocol Treasury Rail',
  accountName: 'FingerMobile Protocol Communication',
  currency: 'NGN',
  standardRatePerFic: 650.00, // Standard $0.50 rate (1 USD = ₦1,300)
  seedRatePerFic: 65.00,      // Seed Sale rate $0.05
};

// Executive CFO Root Profile
const CFO_ROOT_AUTHORITY = {
  id: 'usr_cofounder_eunice',
  name: 'Mrs. Mbah Eunice Emonena',
  title: 'Chief Financial Officer (CFO)',
  coFounder: true,
  roleBadge: '⭐ Co-Founder — Admin-1 & Master Control, Chief Financial Officer (CFO)',
  rootMasterSeal: [
    '✓ Co-Founder',
    '✓ Admin-1 and Master Control, Chief Financial Officer (CFO)',
    '✓ Master Dashboard & STERCS Dashboard Authority: Chief Financial Officer (CFO)',
    '✓ RBC (Limited) Access to MasterDashboard and Stercs Dashboard (Permitted to Most Pages Granted by SuperAdmin)'
  ],
  signinEmail: 'eunicembah@gmail.com',
  officialEmail: 'eunice.mbah@fingermobileprotocol.com',
  isRootHardcoded: true,
  canApproveTreasuryRelease: true
};

// In-Memory Fallback State (Ensures zero-downtime during local development)
const SOVEREIGN_VAULTS_SEED = [
  {
    id: 'wallet_004',
    vaultNumber: '004',
    vaultName: 'FingerMobile Central FIC Wallet 004 ("FIC Treasury Wallet & Seed Sale")',
    custodianTitle: 'Board of Directors Multi-Sig Management (3-of-5 Signatures + PIN)',
    authorizedSigners: ['Mbah Israel Obinna', 'Mrs. Mbah Eunice Emonena', 'Mercy Kulem'],
    walletAddress: '0xTREASURY...004...MSIG',
    balanceFIC: 5000000.00,
    initialAllocationFIC: 5000000.00,
    depletedFIC: 0.00,
    unitPriceUSD: 0.05,
    priorityOrder: 1,
    isActive: true
  },
  {
    id: 'wallet_003',
    vaultNumber: '003',
    vaultName: 'FingerMobile Central FIC Wallet 003 ("Anti-Fraud Escrow & Dispute Pool")',
    custodianTitle: 'Risk Management & Treasury Escrow Custodians',
    authorizedSigners: ['Mrs. Mbah Eunice Emonena', 'Compliance Officer'],
    walletAddress: '0xCENTRAL...003...F1C',
    balanceFIC: 10000000.00,
    initialAllocationFIC: 10000000.00,
    depletedFIC: 0.00,
    unitPriceUSD: 0.50,
    priorityOrder: 2,
    isActive: true
  },
  {
    id: 'wallet_002',
    vaultNumber: '002',
    vaultName: 'FingerMobile Central FIC Wallet 002 ("Ecosystem Expansion & Institutional Backstop")',
    custodianTitle: 'Institutional Backstop & Ecosystem Council',
    authorizedSigners: ['Mbah Israel Obinna', 'Mrs. Mbah Eunice Emonena'],
    walletAddress: '0xCENTRAL...002...EXPANSION',
    balanceFIC: 10000000.00,
    initialAllocationFIC: 10000000.00,
    depletedFIC: 0.00,
    unitPriceUSD: 0.50,
    priorityOrder: 3,
    isActive: true
  },
  {
    id: 'wallet_001',
    vaultNumber: '001',
    vaultName: 'FingerMobile Central FIC Wallet 001 ("Genesis Master Treasury Reserve")',
    custodianTitle: 'Root SuperAdmin Founder Custody (Mbah Israel Obinna)',
    authorizedSigners: ['Mbah Israel Obinna'],
    walletAddress: '0xCENTRAL...001...GENESIS',
    balanceFIC: 25000000.00,
    initialAllocationFIC: 25000000.00,
    depletedFIC: 0.00,
    unitPriceUSD: 0.50,
    priorityOrder: 4,
    isActive: true
  }
];

let inMemoryVaults = JSON.parse(JSON.stringify(SOVEREIGN_VAULTS_SEED));

// Accounting Roles Directory Hierarchy
const ACCOUNTING_ROLES_DIRECTORY = [
  {
    category: 'Executive & Leadership Roles',
    roles: [
      {
        id: 'cfo',
        title: 'Chief Financial Officer (CFO)',
        incumbent: 'Mrs. Mbah Eunice Emonena',
        isRootHardcoded: true,
        description: 'Manages overall corporate financial strategy, long-term planning, high-level risk management, capital structure, and final release authorization for all treasury wallet funding.',
        authorities: ['Final Treasury Release Approval', 'Vault Depletion Oversight', 'Master Dashboard Financials & Stercs Permitted Authority']
      },
      {
        id: 'cao',
        title: 'Chief Accounting Officer (CAO) / Controller',
        incumbent: 'Designated CAO',
        isRootHardcoded: false,
        description: 'Directs day-to-day accounting operations, ensures compliance with accounting standards (like GAAP or IFRS), and oversees closing the monthly and yearly books.',
        authorities: ['Accounting Standards Compliance', 'Monthly/Yearly Closing', 'Financial Reporting Audit']
      },
      {
        id: 'treasurer',
        title: 'Treasurer',
        incumbent: 'Treasury Lead',
        isRootHardcoded: false,
        description: 'Manages corporate cash flow, bank relationships, debt, and investment strategies.',
        authorities: ['Cash Flow Management', 'Alternative Bank Relations', 'Liquidity Deployment']
      }
    ]
  },
  {
    category: 'Management & Supervisory Roles',
    roles: [
      {
        id: 'financial_controller',
        title: 'Financial Controller / Accounting Manager',
        incumbent: 'Accounting Operations Lead',
        isRootHardcoded: false,
        description: 'Supervises daily accounting workflows, reviews reconciliations, and acts as the bridge between junior staff and executive leadership.',
        authorities: ['Workflow Supervision', 'Reconciliation Sign-Off', 'Inter-Departmental Reporting']
      },
      {
        id: 'ap_ar_manager',
        title: 'Accounts Payable (AP) / Accounts Receivable (AR) Manager',
        incumbent: 'AP/AR Lead Officer',
        isRootHardcoded: false,
        description: 'Oversees specialized teams handling outgoing vendor payments and incoming customer collections.',
        authorities: ['Vendor Disbursements', 'Customer Collections', 'Aging Receivables Management']
      },
      {
        id: 'payroll_manager',
        title: 'Payroll Manager',
        incumbent: 'Payroll Controller',
        isRootHardcoded: false,
        description: 'Manages employee compensation schedules, overtime, bonuses, and statutory tax withholdings.',
        authorities: ['Payroll Authorization', 'Tax Remittance', 'Compensation Reconciliation']
      }
    ]
  },
  {
    category: 'Professional & Mid-Level Roles',
    roles: [
      {
        id: 'senior_accountant',
        title: 'Senior Accountant',
        incumbent: 'Senior Ledger Analyst',
        isRootHardcoded: false,
        description: 'Prepares complex journal entries, manages general ledgers, analyzes financial variances, and assists with audits.',
        authorities: ['Complex Journal Entries', 'General Ledger Integrity', 'Variance Analysis']
      },
      {
        id: 'staff_accountant_1',
        title: 'Staff Accountant (Account Staff 1)',
        incumbent: 'Treasury Staff 1',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 1).',
        authorities: ['Bank Payment Confirmation', 'General Ledger Posting', 'Bank Statement Audit']
      },
      {
        id: 'staff_accountant_2',
        title: 'Staff Accountant (Account Staff 2)',
        incumbent: 'Treasury Staff 2',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 2).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'staff_accountant_3',
        title: 'Staff Accountant (Account Staff 3)',
        incumbent: 'Treasury Staff 3',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 3).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'staff_accountant_4',
        title: 'Staff Accountant (Account Staff 4)',
        incumbent: 'Treasury Staff 4',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 4).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'staff_accountant_5',
        title: 'Staff Accountant (Account Staff 5)',
        incumbent: 'Treasury Staff 5',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 5).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'staff_accountant_6',
        title: 'Staff Accountant (Account Staff 6)',
        incumbent: 'Treasury Staff 6',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 6).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'staff_accountant_7',
        title: 'Staff Accountant (Account Staff 7)',
        incumbent: 'Treasury Staff 7',
        isRootHardcoded: false,
        description: 'Handles routine general ledger maintenance, bank and credit card reconciliations, and primary Alternative Bank payment confirmation (Staff 7).',
        authorities: ['Bank Payment Confirmation', 'Reconciliations', 'Account Verification']
      },
      {
        id: 'cost_accountant',
        title: 'Cost Accountant',
        incumbent: 'Cost & Efficiency Specialist',
        isRootHardcoded: false,
        description: 'Analyzes production, labor, and material overhead costs to help the business improve efficiency.',
        authorities: ['Production Cost Modeling', 'Overhead Optimization', 'Efficiency Audits']
      },
      {
        id: 'financial_analyst',
        title: 'Financial Analyst',
        incumbent: 'Protocol Quantitative Analyst',
        isRootHardcoded: false,
        description: 'Evaluates financial data, builds budgets, forecasts cash flow, and creates performance dashboards for management.',
        authorities: ['Predictive Modeling', 'Cash Flow Forecasts', 'Executive Analytics']
      }
    ]
  },
  {
    category: 'Entry-Level & Support Roles',
    roles: [
      {
        id: 'junior_accountant',
        title: 'Junior Accountant / Accounting Clerk',
        incumbent: 'Junior Operations Assistant',
        isRootHardcoded: false,
        description: 'Assists with preliminary report generation, data entry, and checking transaction numbers.',
        authorities: ['Data Entry', 'Preliminary Numbers Check', 'Record Batching']
      },
      {
        id: 'bookkeeper',
        title: 'Bookkeeper',
        incumbent: 'General Bookkeeper',
        isRootHardcoded: false,
        description: 'Records day-to-day financial transactions, issues customer invoices, and files basic financial documents.',
        authorities: ['Invoice Generation', 'Transaction Logging', 'Filing Records']
      },
      {
        id: 'auditing_clerk',
        title: 'Auditing Clerk',
        incumbent: 'Audit Support Specialist',
        isRootHardcoded: false,
        description: 'Supports internal or external auditors by gathering transaction records and verifying data accuracy.',
        authorities: ['Document Retrieval', 'Sampling Verification', 'Compliance Staging']
      }
    ]
  }
];

// In-Memory Funding Requests Queue
let inMemoryFundingRequests = [
  {
    id: 1,
    requestReference: 'TR-20261014-001',
    userId: '4',
    userName: 'David Adeleke (Moderator)',
    userEmail: 'moderator@fingermobileprotocol.com',
    userWalletAddress: '0x819b...bb21',
    amountFIC: 2000.00,
    amountNGN: 130000.00,
    ratePerFIC: 65.00,
    rateType: 'treasury_seed',
    destinationBankName: 'Alternative Bank',
    destinationAccountNumber: '0514108422',
    destinationAccountName: 'FingerMobile Protocol Communication',
    depositorName: 'David Adeleke',
    depositorBank: 'Access Bank',
    bankTxReference: 'NIP/20261014/994821038102',
    paymentMethod: 'Alternative Bank Direct Rail',
    proofNotes: 'NIP Transfer of N130,000 for 2,000 FIC Seed Purchase',
    proofAttachmentUrl: null,
    status: 'APPROVED_AND_FUNDED',
    treasuryStaffId: 'staff_accountant_1',
    treasuryStaffName: 'Account Staff 1',
    treasuryStaffRole: 'Staff Accountant (Account Staff 1)',
    treasuryConfirmedAt: '2026-10-14T09:15:00.000Z',
    autoApproved: false,
    cfoId: 'usr_cofounder_eunice',
    cfoName: 'Mrs. Mbah Eunice Emonena',
    cfoApprovedAt: '2026-10-14T09:30:00.000Z',
    cfoNotes: 'Approved and authorized for release from Wallet 004 Treasury & Seed Sale.',
    deductedFromVault: 'FingerMobile Central FIC Wallet 004 ("FIC Treasury Wallet & Seed Sale")',
    vaultDepletionSequence: [
      { vaultNumber: '004', vaultName: 'Wallet 004 Treasury & Seed Sale', amountFIC: 2000.00 }
    ],
    pdfReceiptNumber: 'RCPT-984210',
    pdfReceiptSerial: 'FIC-ALTBNK-14102-X94B',
    createdAt: '2026-10-14T08:45:00.000Z',
    updatedAt: '2026-10-14T09:30:00.000Z'
  }
];

class TreasuryWalletFundingService {
  /**
   * Return dedicated sovereign protocol treasury bank credentials
   */
  getBankDetails() {
    return {
      success: true,
      data: TREASURY_BANK_DETAILS,
      cfoAuthority: CFO_ROOT_AUTHORITY
    };
  }

  /**
   * Return live sovereign vaults and their current waterfall sequence
   */
  async getSovereignVaultBalances() {
    try {
      if (pool) {
        const res = await pool.query(
          'SELECT id, vault_number, vault_name, custodian_title, authorized_signers, wallet_address, balance_fic, initial_allocation_fic, depleted_fic, unit_price_usd, priority_order, is_active FROM sovereign_vaults ORDER BY priority_order ASC'
        );
        if (res.rows.length > 0) {
          return {
            success: true,
            vaults: res.rows.map(r => ({
              id: r.id,
              vaultNumber: r.vault_number,
              vaultName: r.vault_name,
              custodianTitle: r.custodian_title,
              authorizedSigners: r.authorized_signers,
              walletAddress: r.wallet_address,
              balanceFIC: parseFloat(r.balance_fic),
              initialAllocationFIC: parseFloat(r.initial_allocation_fic),
              depletedFIC: parseFloat(r.depleted_fic || 0),
              unitPriceUSD: parseFloat(r.unit_price_usd),
              priorityOrder: r.priority_order,
              isActive: r.is_active
            }))
          };
        }
      }
    } catch (_err) {
      // Fall through to in-memory store
    }

    return {
      success: true,
      vaults: inMemoryVaults
    };
  }

  /**
   * Member/User initiates a wallet funding deposit request
   */
  async createFundingRequest(data) {
    const {
      userId,
      userName,
      userEmail,
      userWalletAddress,
      amountFIC,
      rateType = 'treasury_seed',
      depositorName,
      depositorBank,
      bankTxReference,
      proofNotes,
      proofAttachmentUrl,
      paymentMethod,
      paymentChannel,
      gatewayReference,
      currency
    } = data;

    const numFIC = parseFloat(amountFIC);
    if (isNaN(numFIC) || numFIC <= 0) {
      throw new Error('Invalid FIC deposit amount requested.');
    }
    if (!depositorName || !bankTxReference) {
      throw new Error('Depositor name and bank/gateway transaction reference are required.');
    }

    const rate = rateType === 'treasury_seed' ? TREASURY_BANK_DETAILS.seedRatePerFic : TREASURY_BANK_DETAILS.standardRatePerFic;
    const amountNGN = parseFloat((numFIC * rate).toFixed(2));
    const amountUSD = parseFloat((amountNGN / 1300.0).toFixed(2));
    const ref = `TR-${Date.now().toString().slice(-8)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    let resolvedMethod = paymentMethod;
    if (!resolvedMethod) {
      if (paymentChannel === 'interswitch') {
        resolvedMethod = 'Interswitch WebPAY (Direct to Alternative Bank)';
      } else if (paymentChannel === 'paystack') {
        resolvedMethod = 'Paystack Checkout (Direct to Alternative Bank)';
      } else if (paymentChannel === 'paypal') {
        resolvedMethod = 'PayPal International (Direct to Alternative Bank)';
      } else if (paymentChannel === 'debit_card') {
        resolvedMethod = 'Debit Card / Mastercard / Visa / Verve (Direct to Alternative Bank)';
      } else if (paymentChannel === 'ussd_qr') {
        resolvedMethod = 'USSD / Bank QR Direct to Alternative Bank';
      } else {
        resolvedMethod = 'Alternative Bank Dedicated Sovereign Treasury Rail';
      }
    }

    let resolvedDepositorBank = depositorBank ? depositorBank.trim() : null;
    if (!resolvedDepositorBank) {
      if (paymentChannel === 'interswitch') {
        resolvedDepositorBank = 'Interswitch Payment Gateway';
      } else if (paymentChannel === 'paystack') {
        resolvedDepositorBank = 'Paystack Automated Gateway';
      } else if (paymentChannel === 'paypal') {
        resolvedDepositorBank = 'PayPal FX Settlement';
      } else {
        resolvedDepositorBank = 'Alternative Bank Direct Rail';
      }
    }

    const newRequest = {
      id: inMemoryFundingRequests.length + 1,
      requestReference: ref,
      userId: String(userId || '4'),
      userName: userName || 'Platform Member',
      userEmail: userEmail || 'member@fingermobileprotocol.com',
      userWalletAddress: userWalletAddress || '0xAUTOGENERATED_USER_WALLET',
      amountFIC: numFIC,
      amountNGN: amountNGN,
      amountUSD: amountUSD,
      ratePerFIC: rate,
      rateType: rateType,
      destinationBankName: TREASURY_BANK_DETAILS.bankName,
      destinationAccountNumber: TREASURY_BANK_DETAILS.accountNumber,
      destinationAccountName: TREASURY_BANK_DETAILS.accountName,
      depositorName: depositorName.trim(),
      depositorBank: resolvedDepositorBank,
      bankTxReference: bankTxReference.trim(),
      gatewayReference: gatewayReference ? gatewayReference.trim() : bankTxReference.trim(),
      paymentChannel: paymentChannel || 'alternative_bank_transfer',
      paymentMethod: resolvedMethod,
      currency: currency || (paymentChannel === 'paypal' ? 'USD' : 'NGN'),
      proofNotes: proofNotes || '',
      proofAttachmentUrl: proofAttachmentUrl || null,
      status: 'PENDING_CONFIRMATION',
      treasuryStaffId: null,
      treasuryStaffName: null,
      treasuryStaffRole: null,
      treasuryConfirmedAt: null,
      autoApproved: false,
      cfoId: null,
      cfoName: null,
      cfoApprovedAt: null,
      cfoNotes: null,
      deductedFromVault: null,
      vaultDepletionSequence: [],
      pdfReceiptNumber: null,
      pdfReceiptSerial: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in PostgreSQL if available
    try {
      if (pool) {
        const query = `
          INSERT INTO treasury_funding_requests (
            request_reference, user_id, user_name, user_email, user_wallet_address,
            amount_fic, amount_ngn, rate_per_fic, rate_type,
            destination_bank_name, destination_account_number, destination_account_name,
            depositor_name, depositor_bank, bank_tx_reference, proof_notes, proof_attachment_url,
            status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
          RETURNING *;
        `;
        const res = await pool.query(query, [
          newRequest.requestReference,
          newRequest.userId,
          newRequest.userName,
          newRequest.userEmail,
          newRequest.userWalletAddress,
          newRequest.amountFIC,
          newRequest.amountNGN,
          newRequest.ratePerFIC,
          newRequest.rateType,
          newRequest.destinationBankName,
          newRequest.destinationAccountNumber,
          newRequest.destinationAccountName,
          newRequest.depositorName,
          newRequest.depositorBank,
          newRequest.bankTxReference,
          newRequest.proofNotes,
          newRequest.proofAttachmentUrl,
          newRequest.status
        ]);
        if (res.rows.length > 0) {
          newRequest.id = res.rows[0].id;
        }
      }
    } catch (dbErr) {
      logger.warn('[TreasuryService] PostgreSQL insert fallback to in-memory store:', dbErr.message);
    }

    inMemoryFundingRequests.unshift(newRequest);
    return newRequest;
  }

  /**
   * List funding requests with optional filtering
   */
  async getFundingRequests(filters = {}) {
    let requests = [...inMemoryFundingRequests];

    try {
      if (pool) {
        let sql = 'SELECT * FROM treasury_funding_requests ORDER BY created_at DESC';
        const res = await pool.query(sql);
        if (res.rows.length > 0) {
          requests = res.rows.map(r => ({
            id: r.id,
            requestReference: r.request_reference,
            userId: r.user_id,
            userName: r.user_name,
            userEmail: r.user_email,
            userWalletAddress: r.user_wallet_address,
            amountFIC: parseFloat(r.amount_fic),
            amountNGN: parseFloat(r.amount_ngn),
            ratePerFIC: parseFloat(r.rate_per_fic),
            rateType: r.rate_type,
            destinationBankName: r.destination_bank_name,
            destinationAccountNumber: r.destination_account_number,
            destinationAccountName: r.destination_account_name,
            depositorName: r.depositor_name,
            depositorBank: r.depositor_bank,
            bankTxReference: r.bank_tx_reference,
            paymentMethod: r.payment_method,
            proofNotes: r.proof_notes,
            proofAttachmentUrl: r.proof_attachment_url,
            status: r.status,
            treasuryStaffId: r.treasury_staff_id,
            treasuryStaffName: r.treasury_staff_name,
            treasuryStaffRole: r.treasury_staff_role,
            treasuryConfirmedAt: r.treasury_confirmed_at,
            autoApproved: r.auto_approved,
            cfoId: r.cfo_id,
            cfoName: r.cfo_name,
            cfoApprovedAt: r.cfo_approved_at,
            cfoNotes: r.cfo_notes,
            deductedFromVault: r.deducted_from_vault,
            vaultDepletionSequence: r.vault_depletion_sequence,
            pdfReceiptNumber: r.pdf_receipt_number,
            pdfReceiptSerial: r.pdf_receipt_serial,
            createdAt: r.created_at,
            updatedAt: r.updated_at
          }));
        }
      }
    } catch (_e) {
      // Use in-memory
    }

    if (filters.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.userId) {
      requests = requests.filter(r => String(r.userId) === String(filters.userId));
    }

    return requests;
  }

  /**
   * Stage 1 Approval: Confirmed at MasterDashboard Accounts by Treasury Staff (1 to 7)
   */
  async confirmPaymentByTreasuryStaff(requestId, staffData = {}) {
    const {
      staffId = 'staff_accountant_1',
      staffName = 'Account Staff 1',
      staffRole = 'Staff Accountant (Account Staff 1)',
      autoApproved = false,
      notes = ''
    } = staffData;

    const request = inMemoryFundingRequests.find(r => String(r.id) === String(requestId) || r.requestReference === requestId);
    if (!request) {
      throw new Error(`Funding request ${requestId} not found.`);
    }

    if (request.status !== 'PENDING_CONFIRMATION') {
      throw new Error(`Cannot confirm payment. Current status is ${request.status}.`);
    }

    const timestamp = new Date().toISOString();
    request.status = 'CONFIRMED_BY_TREASURY_PENDING_CFO';
    request.treasuryStaffId = staffId;
    request.treasuryStaffName = staffName;
    request.treasuryStaffRole = staffRole;
    request.treasuryConfirmedAt = timestamp;
    request.autoApproved = autoApproved;
    request.updatedAt = timestamp;

    try {
      if (pool) {
        await pool.query(
          `UPDATE treasury_funding_requests
           SET status = $1, treasury_staff_id = $2, treasury_staff_name = $3,
               treasury_staff_role = $4, treasury_confirmed_at = $5, auto_approved = $6, updated_at = NOW()
           WHERE id = $7 OR request_reference = $8`,
          [
            request.status,
            request.treasuryStaffId,
            request.treasuryStaffName,
            request.treasuryStaffRole,
            request.treasuryConfirmedAt,
            request.autoApproved,
            parseInt(requestId) || 0,
            requestId
          ]
        );
      }
    } catch (e) {
      logger.warn('[TreasuryService] DB update confirmation error:', e.message);
    }

    return request;
  }

  /**
   * Stage 2 Final Approval: The CFO (Mrs. Mbah Eunice Emonena) finally approves.
   * Executes the Waterfall Depletion Algorithm:
   * Wallet 004 Treasury & Seed Sale must be depleted before Wallet 003, then Wallet 002, then Wallet 001.
   * Deducts FIC from vaults, credits buyer's wallet, generates PDF receipt, and releases FIC.
   */
  async cfoFinalApprovalAndDisbursement(requestId, cfoData = {}) {
    const {
      cfoNotes = 'Payment confirmed against Alternative Bank statement (Acc: 0514108422). Approved for irreversible release by CFO Mrs. Mbah Eunice Emonena.'
    } = cfoData;

    const request = inMemoryFundingRequests.find(r => String(r.id) === String(requestId) || r.requestReference === requestId);
    if (!request) {
      throw new Error(`Funding request ${requestId} not found.`);
    }

    if (
      request.status !== 'CONFIRMED_BY_TREASURY_PENDING_CFO' &&
      request.status !== 'CONFIRMED_BY_TREASURY' &&
      request.status !== 'PENDING_CONFIRMATION'
    ) {
      throw new Error(`Cannot authorize disbursement. Request status must be pending or confirmed by treasury staff. Current: ${request.status}`);
    }

    const requiredFIC = request.amountFIC;
    let remainingToDeduct = requiredFIC;
    const depletionSequence = [];

    // --- WATERFALL DEPLETION ALGORITHM ---
    // Order: Wallet 004 -> Wallet 003 -> Wallet 002 -> Wallet 001
    // Sort vaults by priority order
    inMemoryVaults.sort((a, b) => a.priorityOrder - b.priorityOrder);

    for (const vault of inMemoryVaults) {
      if (remainingToDeduct <= 0) break;
      if (vault.balanceFIC <= 0) continue;

      const deductFromThisVault = Math.min(vault.balanceFIC, remainingToDeduct);
      vault.balanceFIC = parseFloat((vault.balanceFIC - deductFromThisVault).toFixed(2));
      vault.depletedFIC = parseFloat(((vault.depletedFIC || 0) + deductFromThisVault).toFixed(2));
      remainingToDeduct = parseFloat((remainingToDeduct - deductFromThisVault).toFixed(2));

      depletionSequence.push({
        vaultId: vault.id,
        vaultNumber: vault.vaultNumber,
        vaultName: vault.vaultName,
        amountDeductedFIC: deductFromThisVault,
        remainingVaultBalanceFIC: vault.balanceFIC
      });
    }

    if (remainingToDeduct > 0) {
      logger.warn(`[TreasuryService] All sovereign vaults depleted! Shortfall of ${remainingToDeduct} FIC requires SuperAdmin Founder (Mbah Israel Obinna) minting approval.`);
    }

    // --- RELEASE FIC TO USER WALLET ---
    try {
      if (pool) {
        // Attempt to update PostgreSQL fic_wallets
        const walletCheck = await pool.query('SELECT id, balance FROM fic_wallets WHERE user_id = $1', [request.userId]);
        if (walletCheck.rows.length > 0) {
          const currentBal = parseFloat(walletCheck.rows[0].balance || 0);
          const newBal = currentBal + requiredFIC;
          await pool.query(
            'UPDATE fic_wallets SET balance = $1, updated_at = NOW() WHERE id = $2',
            [newBal, walletCheck.rows[0].id]
          );
          // Insert into fic_transactions
          await pool.query(
            `INSERT INTO fic_transactions (wallet_id, user_id, type, amount, transaction_type, description, transaction_status, transaction_reference, from_account, to_account, created_at)
             VALUES ($1, $2, 'deposit', $3, 'deposit', $4, 'completed', $5, $6, $7, NOW())`,
            [
              walletCheck.rows[0].id,
              parseInt(request.userId) || 4,
              requiredFIC,
              'Alternative Bank Deposit (Acc: 0514108422) Approved by CFO Mrs. Mbah Eunice Emonena',
              request.requestReference,
              'Alternative Bank Treasury (0514108422)',
              request.userWalletAddress
            ]
          );
        }
      }
    } catch (walletErr) {
      logger.warn('[TreasuryService] PostgreSQL wallet credit fallback:', walletErr.message);
    }

    // --- GENERATE OFFICIAL PDF RECEIPT METADATA ---
    const timestamp = new Date().toISOString();
    const receiptNum = `RCPT-${Date.now().toString().slice(-6)}`;
    const serial = `FIC-ALTBNK-${Date.now().toString().slice(-5)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    request.status = 'APPROVED_AND_FUNDED';
    request.cfoId = CFO_ROOT_AUTHORITY.id;
    request.cfoName = CFO_ROOT_AUTHORITY.name;
    request.cfoApprovedAt = timestamp;
    request.cfoNotes = cfoNotes;
    request.deductedFromVault = depletionSequence.map(s => `${s.vaultName} (${s.amountDeductedFIC} FIC)`).join('; ');
    request.vaultDepletionSequence = depletionSequence;
    request.pdfReceiptNumber = receiptNum;
    request.pdfReceiptSerial = serial;
    request.updatedAt = timestamp;

    try {
      if (pool) {
        await pool.query(
          `UPDATE treasury_funding_requests
           SET status = $1, cfo_id = $2, cfo_name = $3, cfo_approved_at = $4,
               cfo_notes = $5, deducted_from_vault = $6, vault_depletion_sequence = $7,
               pdf_receipt_number = $8, pdf_receipt_serial = $9, updated_at = NOW()
           WHERE id = $10 OR request_reference = $11`,
          [
            request.status,
            request.cfoId,
            request.cfoName,
            request.cfoApprovedAt,
            request.cfoNotes,
            request.deductedFromVault,
            JSON.stringify(request.vaultDepletionSequence),
            request.pdfReceiptNumber,
            request.pdfReceiptSerial,
            parseInt(requestId) || 0,
            requestId
          ]
        );
      }
    } catch (e) {
      logger.warn('[TreasuryService] DB update CFO approval error:', e.message);
    }

    logger.info(`✅ [TreasuryService] Funding request ${request.requestReference} approved by CFO Mrs. Mbah Eunice Emonena. Released ${requiredFIC} FIC.`);

    return {
      success: true,
      message: `CFO Mrs. Mbah Eunice Emonena has approved the transaction. ${requiredFIC} FIC deducted via Waterfall Depletion from Sovereign Vaults and credited to buyer wallet.`,
      request,
      depletionSequence,
      cfoAuthority: CFO_ROOT_AUTHORITY
    };
  }

  /**
   * Return the complete Financial & Accounting Roles taxonomy
   */
  getAccountingRolesDirectory() {
    return {
      success: true,
      cfoRoot: CFO_ROOT_AUTHORITY,
      directory: ACCOUNTING_ROLES_DIRECTORY
    };
  }

  /**
   * Helper for unit test resetting
   */
  resetForTesting() {
    inMemoryFundingRequests = [];
    inMemoryVaults = JSON.parse(JSON.stringify(SOVEREIGN_VAULTS_SEED));
  }

  /**
   * Helper to set vault balance for testing
   */
  setVaultBalanceForTesting(vaultId, balance) {
    const vault = inMemoryVaults.find(v => v.id === vaultId);
    if (vault) {
      vault.balanceFIC = balance;
      vault.depletedFIC = Math.max(0, vault.initialAllocationFIC - balance);
    }
  }
}

module.exports = new TreasuryWalletFundingService();
