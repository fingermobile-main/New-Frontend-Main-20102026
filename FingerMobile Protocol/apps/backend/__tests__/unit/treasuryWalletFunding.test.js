/**
 * Unit Test Suite for Treasury Wallet Funding Service & Waterfall Depletion
 * Strict adherence to Platform Policy: Zero Error Margin
 */

const treasuryService = require('../../services/treasuryWalletFundingService');

describe('Treasury Wallet Funding & Accounting Roles Unit Suite', () => {
  beforeEach(() => {
    // Reset service state before tests
    treasuryService.resetForTesting();
  });

  describe('1. Dedicated Sovereign Protocol Treasury Rail', () => {
    it('should return Alternative Bank dedicated rail details with correct account number', () => {
      const res = treasuryService.getBankDetails();
      expect(res.success).toBe(true);
      const rail = res.data;
      expect(rail.bankName).toBe('Alternative Bank');
      expect(rail.accountNumber).toBe('0514108422');
      expect(rail.accountName).toBe('FingerMobile Protocol Communication');
      expect(rail.licenseStatus).toBe('CBN Licensed & Supervised Institution');
      expect(rail.railTitle).toBe('Dedicated Sovereign Protocol Treasury Rail');
      expect(rail.seedRatePerFic).toBe(65.0);
      expect(rail.standardRatePerFic).toBe(650.0);
    });
  });

  describe('2. Sovereign Vault Waterfall Order', () => {
    it('should initialize 4 vaults with Wallet 004 as Priority 1 (Depleted First)', async () => {
      const res = await treasuryService.getSovereignVaultBalances();
      expect(res.success).toBe(true);
      const vaults = res.vaults;
      expect(vaults.length).toBe(4);
      expect(vaults[0].vaultNumber).toBe('004');
      expect(vaults[0].priorityOrder).toBe(1);
      expect(vaults[0].balanceFIC).toBe(5000000);

      expect(vaults[1].vaultNumber).toBe('003');
      expect(vaults[1].priorityOrder).toBe(2);

      expect(vaults[2].vaultNumber).toBe('002');
      expect(vaults[2].priorityOrder).toBe(3);

      expect(vaults[3].vaultNumber).toBe('001');
      expect(vaults[3].priorityOrder).toBe(4);
    });
  });

  describe('3. End-to-End Funding Flow: Request -> Staff Confirmation -> CFO Approval & Release', () => {
    it('should successfully execute the full lifecycle from deposit to CFO approval and 004 depletion', async () => {
      // Step 1: Member creates funding request
      const req = await treasuryService.createFundingRequest({
        userId: '10',
        userName: 'Amina Bello',
        userEmail: 'amina.bello@gmail.com',
        userWalletAddress: '0xAMINA...998',
        amountFIC: 1000,
        amountNGN: 65000,
        ratePerFIC: 65.0,
        rateType: 'treasury_seed',
        depositorName: 'Amina Bello',
        depositorBank: 'Alternative Bank',
        bankTxReference: 'ALT/20261014/889900',
        paymentMethod: 'Alternative Bank Direct Rail',
        proofNotes: 'Seed purchase of 1,000 FIC'
      });

      expect(req.id).toBeDefined();
      expect(req.requestReference).toMatch(/^TR-/);
      expect(req.status).toBe('PENDING_CONFIRMATION');
      expect(req.amountFIC).toBe(1000);

      // Step 2: Treasury Staff 3 confirms payment
      const confirmed = await treasuryService.confirmPaymentByTreasuryStaff(req.id, {
        staffId: 'staff_accountant_3',
        staffName: 'Account Staff 3',
        staffRole: 'Staff Accountant (Account Staff 3)',
        autoApproved: false
      });

      expect(confirmed.status).toBe('CONFIRMED_BY_TREASURY_PENDING_CFO');
      expect(confirmed.treasuryStaffName).toBe('Account Staff 3');
      expect(confirmed.treasuryConfirmedAt).toBeDefined();

      // Step 3: Executive CFO Mrs. Mbah Eunice Emonena final approval & release
      const approveRes = await treasuryService.cfoFinalApprovalAndDisbursement(req.id, {
        cfoNotes: 'Verified against Alternative Bank 0514108422 Rail. Release authorized from Wallet 004.'
      });

      expect(approveRes.success).toBe(true);
      const approved = approveRes.request;
      expect(approved.status).toBe('APPROVED_AND_FUNDED');
      expect(approved.cfoName).toBe('Mrs. Mbah Eunice Emonena');
      expect(approved.cfoApprovedAt).toBeDefined();
      expect(approved.pdfReceiptNumber).toMatch(/^RCPT-/);
      expect(approved.pdfReceiptSerial).toMatch(/^FIC-ALTBNK-/);

      // Check vault depletion
      const vaultsRes = await treasuryService.getSovereignVaultBalances();
      const vault004 = vaultsRes.vaults.find((v) => v.vaultNumber === '004');
      expect(vault004.depletedFIC).toBe(1000);
      expect(vault004.balanceFIC).toBe(4999000);
    });

    it('should waterfall deplete Wallet 004 first, then Wallet 003 when 004 is exhausted', async () => {
      // Artificially set 004 balance to 500 FIC
      treasuryService.setVaultBalanceForTesting('wallet_004', 500);

      // Request 800 FIC
      const req = await treasuryService.createFundingRequest({
        userId: '11',
        userName: 'Emeka Okafor',
        userEmail: 'emeka@gmail.com',
        userWalletAddress: '0xEMEKA...771',
        amountFIC: 800,
        amountNGN: 52000,
        ratePerFIC: 65.0,
        rateType: 'treasury_seed',
        depositorName: 'Emeka Okafor',
        depositorBank: 'Access Bank',
        bankTxReference: 'ACC/20261014/443322'
      });

      await treasuryService.confirmPaymentByTreasuryStaff(req.id, {
        staffId: 'staff_accountant_1',
        staffName: 'Account Staff 1'
      });

      const approveRes = await treasuryService.cfoFinalApprovalAndDisbursement(req.id);
      expect(approveRes.success).toBe(true);
      const approved = approveRes.request;
      expect(approved.status).toBe('APPROVED_AND_FUNDED');

      // Depletion sequence should have both 004 (500 FIC) and 003 (300 FIC)
      expect(approveRes.depletionSequence.length).toBe(2);
      expect(approveRes.depletionSequence[0].vaultNumber).toBe('004');
      expect(approveRes.depletionSequence[0].amountDeductedFIC).toBe(500);
      expect(approveRes.depletionSequence[1].vaultNumber).toBe('003');
      expect(approveRes.depletionSequence[1].amountDeductedFIC).toBe(300);

      const vaultsRes = await treasuryService.getSovereignVaultBalances();
      const vault004 = vaultsRes.vaults.find((v) => v.vaultNumber === '004');
      const vault003 = vaultsRes.vaults.find((v) => v.vaultNumber === '003');
      expect(vault004.balanceFIC).toBe(0);
      expect(vault003.balanceFIC).toBe(9999700);
    });
  });

  describe('4. Financial & Accounting Roles Directory', () => {
    it('should return all 4 tiers of accounting roles and hardcoded CFO root profile', () => {
      const res = treasuryService.getAccountingRolesDirectory();
      expect(res.success).toBe(true);
      expect(res.cfoRoot.name).toBe('Mrs. Mbah Eunice Emonena');
      expect(res.cfoRoot.title).toBe('Chief Financial Officer (CFO)');
      expect(res.cfoRoot.isRootHardcoded).toBe(true);
      expect(res.cfoRoot.canApproveTreasuryRelease).toBe(true);

      expect(res.directory.length).toBe(4);
      expect(res.directory[0].category).toBe('Executive & Leadership Roles');
      expect(res.directory[1].category).toBe('Management & Supervisory Roles');
      expect(res.directory[2].category).toBe('Professional & Mid-Level Roles');
      expect(res.directory[3].category).toBe('Entry-Level & Support Roles');

      // Check account staff 1 to 7 exist in Professional tier
      const professionalRoles = res.directory[2].roles;
      for (let i = 1; i <= 7; i++) {
        const staff = professionalRoles.find((r) => r.id === `staff_accountant_${i}`);
        expect(staff).toBeDefined();
        expect(staff.authorities).toContain('Bank Payment Confirmation');
      }
    });
  });
});
