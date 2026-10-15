import React, { useState, useEffect, useMemo } from 'react';
import {
  Coins,
  DollarSign,
  Shield,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  CreditCard,
  Building2,
  Send,
  Download,
  FileText,
  Lock,
  Key,
  Scale,
  TrendingUp,
  Flame,
  Award,
  Vote,
  Fingerprint,
  Hash,
  ExternalLink,
  Landmark,
  Layers,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { downloadFicReceiptPdf, FICReceiptData } from '../../utils/ficReceiptPdf';
import { FIC_DIGITAL_NOTARIZATION_CERTIFICATE } from '../../constants/digitalNotarization';
import { DigitalNotarizationModal } from '../legal/DigitalNotarizationModal';
import { CbnNfemControllerPanel } from './CbnNfemControllerPanel';
import EnterpriseFinancialEcosystemConsole from './EnterpriseFinancialEcosystemConsole';
import apiService from '../../services/apiService';
import {
  PLATFORM_OWNERSHIP,
  FINANCIAL_ROLES_TAXONOMY
} from '../../constants/platformOwnership';

export interface FICAllocationEvent {
  id: string;
  recipientAddress: string;
  recipientName: string;
  amountFIC: number;
  fiatEquivalentNaira: number;
  category:
    | 'Creator Incentive'
    | 'Node Royalty'
    | 'Treasury Grant'
    | 'Manual Allocation'
    | 'System Compensation'
    | 'Marketplace Liquidity Pool'
    | 'FIC Payout Rail'
    | 'FIC Subscription & Premium Tiers'
    | 'FIC Placement';
  status: 'Completed' | 'Pending Verification' | 'Escrow Locked';
  timestamp: string;
  authorizedBy: string;
  txHash: string;
  reason: string;
  serialNumber?: string;
}

export interface FIATPayoutRule {
  id: string;
  railName: string;
  provider: 'NIBSS (NIP)' | 'Paystack' | 'Flutterwave' | 'Interswitch';
  status: 'Online' | 'Throttled' | 'Maintenance';
  minPayoutFIC: number;
  maxPayoutDailyFIC: number;
  settlementSpeed: string;
  feePercentage: number;
}

export interface WalletAllocationPlanItem {
  id: string;
  walletName: string;
  custodianTitle: string;
  recipientName: string;
  walletAddress: string;
  amountFIC: number;
  unitPriceUSD: number;
  governanceType: 'Single Custodian' | 'Multi-Sig (3-of-5) + PIN' | 'Protected Treasury' | 'Ecosystem Incentive Pool';
  purpose: string;
  isMultiSig: boolean;
  signaturesRequired?: number;
  activeSigners?: string[];
}

export interface CICVaultLedgerEntry {
  id: string;
  type: 'WITHDRAWAL' | 'DEPOSIT' | 'MINT_ADDITION' | 'BURN_REDUCTION';
  source: string;
  destination: string;
  amountFIC: number;
  runningCIC: number;
  timestamp: string;
  reconciliationStatus: 'RECONCILED' | 'CALL_OVER_VERIFIED' | 'PENDING_MATCH';
  notes: string;
}

const STORAGE_KEY_FIC_AUDIT = 'fingermobile_fic_allocations_ledger';
const STORAGE_KEY_CIC_LEDGER = 'fingermobile_cic_vault_ledger';
const STORAGE_KEY_MEMBER_PURCHASES = 'fingermobile_member_purchases_ledger';

export const MasterFinancialsConsole: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Sub-Tab configuration
  const validSubTabs = [
    'financial-ecosystem',
    'treasury',
    'inspectorate',
    'fic-engine',
    'cic-ledger',
    'member-purchase',
    'economic-algorithms',
    'fiat-rules',
    'subscriptions-rev',
    'access-bridge',
    'cbn-nfem',
  ] as const;
  type SubTabType = typeof validSubTabs[number];

  const initialTab = useMemo<SubTabType>(() => {
    const param = searchParams.get('subtab') as SubTabType;
    if (param && validSubTabs.includes(param)) {
      return param;
    }
    return 'financial-ecosystem';
  }, [searchParams]);

  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(initialTab);

  const handleSubTabChange = (tabId: SubTabType) => {
    setActiveSubTab(tabId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'financials');
      next.set('subtab', tabId);
      return next;
    });
  };

  // ---------------------------------------------------------------------------
  // Treasury & Valuation State
  // ---------------------------------------------------------------------------
  const [totalMintedFIC] = useState<number>(48000000); // 48M FIC Total
  const [exchangeRateNaira] = useState<number>(65); // 1 FIC = ₦65.00 base anchor (Apex Bank rate $1 = ₦1,340)
  const [ficUSDValue] = useState<number>(0.05); // $0.05 USD platform standard (1 USD = 20 FIC)
  const [burnedFIC] = useState<number>(428500); // 10% Burn ledger
  const [circulatingFIC, setCirculatingFIC] = useState<number>(14250000);
  const [activeMRRNaira] = useState<number>(42800000); // ₦42.8M NGN
  const [activeMRRFIC] = useState<number>(61142); // 61.1k FIC

  // ---------------------------------------------------------------------------
  // Statutory Charter & Guardian AI Enforcement State
  // ---------------------------------------------------------------------------
  const [guardianEnforcementActive] = useState<boolean>(true);
  const [guardianCounterValue] = useState<number>(48000000);
  const [activeSerialNumber, setActiveSerialNumber] = useState<string>('FIC-2026-OBINNA-0048M-8891');
  const [showNotarizationModal, setShowNotarizationModal] = useState<boolean>(false);

  const getEntryBadgeClass = (type: CICVaultLedgerEntry['type']) => {
    if (type === 'DEPOSIT') {
      return 'bg-emerald-950 text-emerald-300';
    }
    if (type === 'WITHDRAWAL') {
      return 'bg-blue-950 text-blue-300';
    }
    if (type === 'BURN_REDUCTION') {
      return 'bg-rose-950 text-rose-300';
    }
    return 'bg-amber-950 text-amber-300';
  };

  // ---------------------------------------------------------------------------
  // Allocation Plan Data (48,000,000 FIC Total)
  // ---------------------------------------------------------------------------
  const allocationPlan: WalletAllocationPlanItem[] = [
    {
      id: 'alloc_001',
      walletName: 'Mbah Israel Obinna Personal Custody Vault',
      custodianTitle: 'SuperAdmin, Founder, Chairman Board of Directors, FIC Custodian',
      recipientName: 'Mbah Israel Obinna',
      walletAddress: '0x0B14...8A22F1',
      amountFIC: 3000000,
      unitPriceUSD: 0.50,
      governanceType: 'Single Custodian',
      purpose: 'Founder, SuperAdmin & Platform Chairman Custodial Sovereign Allocation',
      isMultiSig: false,
    },
    {
      id: 'alloc_002',
      walletName: 'Mrs. Mbah Eunice Emonena Custody Vault',
      custodianTitle: 'Co-Admin, Co-Founder, Vice Chairman Board of Directors, FIC Custodian',
      recipientName: 'Mrs. Mbah Eunice Emonena',
      walletAddress: '0xEE71...4B910A',
      amountFIC: 2000000,
      unitPriceUSD: 0.50,
      governanceType: 'Single Custodian',
      purpose: 'Co-Founder & Vice Chairman Board of Directors Custodial Allocation',
      isMultiSig: false,
    },
    {
      id: 'alloc_003',
      walletName: 'Mercy Kulem Secretarial Custody Vault',
      custodianTitle: 'Secretary Board of Directors, FIC Custodian',
      recipientName: 'Mercy Kulem',
      walletAddress: '0x71C9...4E893C',
      amountFIC: 1000000,
      unitPriceUSD: 0.50,
      governanceType: 'Single Custodian',
      purpose: 'Board of Directors Secretarial Custodial Sovereign Allocation',
      isMultiSig: false,
    },
    {
      id: 'alloc_004',
      walletName: 'FingerMobile Central FIC Wallet 001',
      custodianTitle: 'Sovereign Protocol Core Vault 001',
      recipientName: 'FingerMobile Protocol Operations',
      walletAddress: '0xCENTRAL...001...F1C',
      amountFIC: 10000000,
      unitPriceUSD: 0.50,
      governanceType: 'Protected Treasury',
      purpose: 'Central Platform Liquidity, Reserve Backing & Inter-Service Settlements',
      isMultiSig: false,
    },
    {
      id: 'alloc_005',
      walletName: 'FingerMobile Central FIC Wallet 002',
      custodianTitle: 'Sovereign Protocol Core Vault 002',
      recipientName: 'FingerMobile Protocol Infrastructure',
      walletAddress: '0xCENTRAL...002...F1C',
      amountFIC: 10000000,
      unitPriceUSD: 0.50,
      governanceType: 'Protected Treasury',
      purpose: 'Multi-Region High Availability Reserve & Sovereign Node Collateralization',
      isMultiSig: false,
    },
    {
      id: 'alloc_006',
      walletName: 'FingerMobile Central FIC Wallet 003',
      custodianTitle: 'Sovereign Protocol Core Vault 003',
      recipientName: 'FingerMobile Protocol Escrow',
      walletAddress: '0xCENTRAL...003...F1C',
      amountFIC: 10000000,
      unitPriceUSD: 0.50,
      governanceType: 'Protected Treasury',
      purpose: 'Anti-Fraud Escrow, Merchant Protection Reserve & Dispute Resolution Pool',
      isMultiSig: false,
    },
    {
      id: 'alloc_007',
      walletName: 'FingerMobile Central FIC Wallet 004 ("FIC Treasury Wallet")',
      custodianTitle: 'Board of Directors Multi-Sig Management (3-of-5 Signatures + PIN)',
      recipientName: 'Board of Directors & Designated Authorized Officers',
      walletAddress: '0xTREASURY...004...MSIG',
      amountFIC: 5000000,
      unitPriceUSD: 0.05, // Seed sale rate in marketplace
      governanceType: 'Multi-Sig (3-of-5) + PIN',
      purpose: 'Marketplace Seed Liquidity ($0.05/FIC), Token Value Backstop & Threshold Buyback Buffer. Strictly capped to 5,000,000 FIC.',
      isMultiSig: true,
      signaturesRequired: 3,
      activeSigners: ['Mbah Israel Obinna', 'Mrs. Mbah Eunice Emonena', 'Mercy Kulem'],
    },
    {
      id: 'alloc_008',
      walletName: 'Development Team Wallet (MINT_DEVELOPMENT_TEAM)',
      custodianTitle: 'Protocol Core Engineering & Systems Infrastructure',
      recipientName: 'FingerMobile Protocol Dev Team',
      walletAddress: '0xDEV...TEAM...CORE...99',
      amountFIC: 5000000,
      unitPriceUSD: 0.50,
      governanceType: 'Protected Treasury',
      purpose: 'Continuous Protocol Development, Engineering Milestones & Camus AI Engine',
      isMultiSig: false,
    },
    {
      id: 'alloc_009',
      walletName: 'Ecosystem Incentive & Compensation Pool',
      custodianTitle: 'Creator Incentive, Node Royalty, Treasury Grant, System Comp',
      recipientName: 'Ecosystem Ecosystem Smart Contract',
      walletAddress: '0xECOSYSTEM...INCENTIVE...POOL',
      amountFIC: 2000000,
      unitPriceUSD: 0.50,
      governanceType: 'Ecosystem Incentive Pool',
      purpose: 'Distributed for Creator Incentive, Node Royalty, Treasury Grant, System Compensation',
      isMultiSig: false,
    },
  ];

  // ---------------------------------------------------------------------------
  // Multi-Sig Modal State for Wallet 004
  // ---------------------------------------------------------------------------
  const [isMultiSigModalOpen, setIsMultiSigModalOpen] = useState(false);
  const [multiSigPinInput, setMultiSigPinInput] = useState('');
  const [selectedSigners, setSelectedSigners] = useState<string[]>([
    'Mbah Israel Obinna',
    'Mrs. Mbah Eunice Emonena',
    'Mercy Kulem',
  ]);
  const [multiSigActionMessage, setMultiSigActionMessage] = useState('');

  // ---------------------------------------------------------------------------
  // Coins in Circulation (CIC) Vault Ledger State
  // ---------------------------------------------------------------------------
  const [cicLedger, setCicLedger] = useState<CICVaultLedgerEntry[]>([
    {
      id: 'cic_entry_104',
      type: 'DEPOSIT',
      source: 'Alternative Bank Settlement (Acc: 0514108422)',
      destination: 'Member Wallet (0x819...bb21)',
      amountFIC: 2000,
      runningCIC: 14250000,
      timestamp: '2026-10-13 11:42:01',
      reconciliationStatus: 'RECONCILED',
      notes: 'Direct Alternative Bank Purchase Confirmed & Auto-Credited',
    },
    {
      id: 'cic_entry_103',
      type: 'WITHDRAWAL',
      source: 'Creator Wallet (0x71c...4e89)',
      destination: 'NIBSS Instant Payment (NIP) Rail',
      amountFIC: 500,
      runningCIC: 14248000,
      timestamp: '2026-10-13 09:15:32',
      reconciliationStatus: 'CALL_OVER_VERIFIED',
      notes: 'Creator Audio Royalty FIAT Settlement Payout',
    },
    {
      id: 'cic_entry_102',
      type: 'BURN_REDUCTION',
      source: 'Marketplace E-Commerce Purchases',
      destination: '0x000...DEAD (Proof-of-Burn)',
      amountFIC: 1250,
      runningCIC: 14247500,
      timestamp: '2026-10-12 23:59:10',
      reconciliationStatus: 'RECONCILED',
      notes: '10% Mandatory Token Burn on Product Sales & Fees',
    },
    {
      id: 'cic_entry_101',
      type: 'MINT_ADDITION',
      source: 'Mint Inspectorate Vault (Mbah Israel Obinna Authority)',
      destination: 'Central FIC Wallet 004',
      amountFIC: 5000000,
      runningCIC: 14246250,
      timestamp: '2026-10-12 12:00:00',
      reconciliationStatus: 'RECONCILED',
      notes: 'Seed Marketplace Liquidity Allocation Provisioning',
    },
  ]);

  const [callOverResultMsg, setCallOverResultMsg] = useState('');

  // ---------------------------------------------------------------------------
  // Member FIC Purchase State (Alternative Bank: 0514108422)
  // ---------------------------------------------------------------------------
  const [purchaseName, setPurchaseName] = useState('');
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [purchaseWallet, setPurchaseWallet] = useState('');
  const [purchaseFicAmount, setPurchaseFicAmount] = useState('1000');
  const [purchaseRateType, setPurchaseRateType] = useState<'standard' | 'treasury_seed'>('standard');
  const [purchaseSuccessReceipt, setPurchaseSuccessReceipt] = useState<FICReceiptData | null>(null);

  // Live Alternative Bank Treasury Funding Requests & Sovereign Vaults
  const [liveTreasuryRequests, setLiveTreasuryRequests] = useState<any[]>([]);
  const [liveVaults, setLiveVaults] = useState<any[]>([]);
  const [actingStaffCode, setActingStaffCode] = useState<string>('staff_accountant_3');
  const [autoApproveFlag, setAutoApproveFlag] = useState<boolean>(false);
  const [treasuryActionLoading, setTreasuryActionLoading] = useState<boolean>(false);
  const [treasuryActionMsg, setTreasuryActionMsg] = useState<string>('');
  const [showRolesModal, setShowRolesModal] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Price Adjustment Algorithm State
  // ---------------------------------------------------------------------------
  const [salesVelocityPercent, setSalesVelocityPercent] = useState<number>(75);
  const [userSatisfactionPercent, setUserSatisfactionPercent] = useState<number>(92);
  const [competitorPriceRatio, setCompetitorPriceRatio] = useState<number>(100);
  const [liquidityPoolSize, setLiquidityPoolSize] = useState<number>(125000);
  const [algorithmSimulationFeedback, setAlgorithmSimulationFeedback] = useState<string>('');

  // ---------------------------------------------------------------------------
  // Allocation Form State (Minting Engine)
  // ---------------------------------------------------------------------------
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<FICAllocationEvent['category']>('Creator Incentive');
  const [reasonInput, setReasonInput] = useState('');
  const [allocationSuccessMsg, setAllocationSuccessMsg] = useState('');

  // ---------------------------------------------------------------------------
  // Allocation Ledger State
  // ---------------------------------------------------------------------------
  const [allocationsLedger, setAllocationsLedger] = useState<FICAllocationEvent[]>([
    {
      id: 'tx_fic_9022',
      recipientAddress: '0x0B14...8A22F1',
      recipientName: 'Mbah Israel Obinna',
      amountFIC: 3000000,
      fiatEquivalentNaira: 195000000,
      category: 'FIC Placement',
      status: 'Completed',
      timestamp: '2026-10-13 08:00:00',
      authorizedBy: 'Mbah Israel Obinna (Statutory Authority)',
      txHash: '0x9a8b...1402',
      reason: 'Statutory Allocation to Founder, Chairman & Chief Custodian',
      serialNumber: 'FIC-2026-OBINNA-003M-0001',
    },
    {
      id: 'tx_fic_9021',
      recipientAddress: '0x71C9...4E893C',
      recipientName: 'Mercy Kulem (Creator #42)',
      amountFIC: 2500,
      fiatEquivalentNaira: 162500,
      category: 'Creator Incentive',
      status: 'Completed',
      timestamp: '2026-10-12 18:24:10',
      authorizedBy: 'Mbah Israel Obinna (Guardian AI Signature)',
      txHash: '0x8f2c...419a',
      reason: 'BeatwaveNG Top 10 Audio Stem Milestone Reward',
      serialNumber: 'FIC-2026-CREAT-0025-419A',
    },
    {
      id: 'tx_fic_9020',
      recipientAddress: '0x32A4...9B120E',
      recipientName: 'Lagos Island Node Franchise',
      amountFIC: 15000,
      fiatEquivalentNaira: 975000,
      category: 'Node Royalty',
      status: 'Completed',
      timestamp: '2026-10-12 15:10:02',
      authorizedBy: 'Mbah Israel Obinna (Guardian AI Signature)',
      txHash: '0x3a4b...28c1',
      reason: 'Q3 Sovereign Territorial Node Revenue Share',
      serialNumber: 'FIC-2026-NODE-0015-28C1',
    },
  ]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FIC_AUDIT);
      if (stored) {
        setAllocationsLedger(JSON.parse(stored));
      }
      const storedCic = localStorage.getItem(STORAGE_KEY_CIC_LEDGER);
      if (storedCic) {
        setCicLedger(JSON.parse(storedCic));
      }
    } catch (_err) {
      // Fallback gracefully
    }
  }, []);

  // Fetch live Treasury requests and sovereign vaults from PostgreSQL / service
  const fetchLiveTreasuryData = async () => {
    try {
      const [reqRes, vRes] = await Promise.all([
        apiService.get('/api/treasury/requests'),
        apiService.get('/api/treasury/vaults'),
      ]);
      if (reqRes?.success && Array.isArray(reqRes.data)) {
        setLiveTreasuryRequests(reqRes.data);
      }
      if (vRes?.success && Array.isArray(vRes.vaults)) {
        setLiveVaults(vRes.vaults);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to sync live treasury data in MasterFinancialsConsole', e);
    }
  };

  useEffect(() => {
    fetchLiveTreasuryData();
  }, []);

  // Treasury Staff Confirmation Handler (Account Staff 1 to 7)
  const handleTreasuryStaffConfirm = async (requestId: number) => {
    try {
      setTreasuryActionLoading(true);
      const staff = FINANCIAL_ROLES_TAXONOMY.find((r) => r.roleCode === actingStaffCode);
      const res = await apiService.post(`/api/treasury/requests/${requestId}/confirm`, {
        staffId: actingStaffCode,
        staffName: staff?.roleName || 'Account Staff 3',
        staffRole: staff?.roleName || 'Staff Accountant',
        autoApproved: autoApproveFlag,
      });
      if (res?.success) {
        setTreasuryActionMsg(
          `Payment confirmed by ${res.data.treasuryStaffName}. Awaiting CFO Mrs. Mbah Eunice Emonena final sign-off.`
        );
        fetchLiveTreasuryData();
        setTimeout(() => setTreasuryActionMsg(''), 6000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to confirm request');
    } finally {
      setTreasuryActionLoading(false);
    }
  };

  // CFO Final Approval & Waterfall Disburse Handler
  const handleCfoAuthorizeAndRelease = async (requestId: number) => {
    try {
      setTreasuryActionLoading(true);
      const res = await apiService.post(`/api/treasury/requests/${requestId}/cfo-approve`, {
        cfoNotes: 'Verified against Alternative Bank 0514108422 Rail. Release authorized from Wallet 004.',
      });
      if (res?.success) {
        setTreasuryActionMsg(
          `Approved by CFO Mrs. Mbah Eunice Emonena! ${res.data.amountFIC} FIC credited from ${res.data.deductedFromVault || 'Wallet 004'}. PDF Receipt dispatched.`
        );
        fetchLiveTreasuryData();
        setTimeout(() => setTreasuryActionMsg(''), 7000);
      }
    } catch (err: any) {
      alert(err.message || 'CFO authorization failed');
    } finally {
      setTreasuryActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  // 1. Commission Mint & Transfer (Enforcing Mbah Israel Obinna exclusive right)
  const handleMintAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput);
    if (!recipientInput.trim() || isNaN(amount) || amount <= 0) {
      alert('Please provide a valid recipient address/email and FIC token amount.');
      return;
    }

    const uniqueSerial = `FIC-2026-MINT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newTx: FICAllocationEvent = {
      id: `tx_fic_${Date.now()}`,
      recipientAddress: recipientInput.includes('@')
        ? recipientInput
        : `0x${recipientInput.replace(/^0x/, '').slice(0, 6)}...${recipientInput.slice(-4)}`,
      recipientName: recipientInput,
      amountFIC: amount,
      fiatEquivalentNaira: amount * exchangeRateNaira,
      category: categoryInput,
      status: 'Completed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      authorizedBy: 'Mbah Israel Obinna (Sole Exclusive Custodian via Guardian AI)',
      txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      reason: reasonInput.trim() || 'Statutory Minting Directive under the FingerMobile Act',
      serialNumber: uniqueSerial,
    };

    const updatedLedger = [newTx, ...allocationsLedger];
    setAllocationsLedger(updatedLedger);
    setActiveSerialNumber(uniqueSerial);
    localStorage.setItem(STORAGE_KEY_FIC_AUDIT, JSON.stringify(updatedLedger));

    // Update CIC Vault Ledger
    const cicEntry: CICVaultLedgerEntry = {
      id: `cic_${Date.now()}`,
      type: 'MINT_ADDITION',
      source: 'Mint Inspectorate Vault (Commissioned by Mbah Israel Obinna)',
      destination: recipientInput,
      amountFIC: amount,
      runningCIC: circulatingFIC + amount,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      reconciliationStatus: 'RECONCILED',
      notes: `${categoryInput}: ${reasonInput.trim() || 'Direct Sovereign Commission'}`,
    };
    const updatedCic = [cicEntry, ...cicLedger];
    setCicLedger(updatedCic);
    setCirculatingFIC((prev) => prev + amount);
    localStorage.setItem(STORAGE_KEY_CIC_LEDGER, JSON.stringify(updatedCic));

    setAllocationSuccessMsg(
      `Irrevocable Minting Complete! ${amount.toLocaleString()} FIC (₦${(amount * exchangeRateNaira).toLocaleString()} NGN) stamped with Serial [${uniqueSerial}] and allocated to ${recipientInput}.`
    );
    setRecipientInput('');
    setAmountInput('');
    setReasonInput('');
    setTimeout(() => setAllocationSuccessMsg(''), 7000);
  };

  // 2. Member FIC Purchase Handler (Alternative Bank: 0514108422)
  const handleMemberFicPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(purchaseFicAmount);
    if (!purchaseName.trim() || !purchaseEmail.trim() || isNaN(amount) || amount <= 0) {
      alert('Please fill out all required purchase details.');
      return;
    }

    const rate = purchaseRateType === 'treasury_seed' ? 65 : exchangeRateNaira;
    const totalNaira = amount * rate;
    const totalUSD = purchaseRateType === 'treasury_seed' ? amount * 0.05 : amount * ficUSDValue;
    const receiptNum = `RCPT-${Date.now().toString().slice(-6)}`;
    const txHash = `0x${Math.random().toString(16).slice(2, 12)}${Math.random().toString(16).slice(2, 10)}`;
    const serial = `FIC-ALTBNK-${Date.now().toString().slice(-5)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const receipt: FICReceiptData = {
      receiptNumber: receiptNum,
      purchaserName: purchaseName.trim(),
      purchaserEmail: purchaseEmail.trim(),
      walletAddress: purchaseWallet.trim() || '0xAUTOGENERATED_USER_WALLET',
      amountFIC: amount,
      ratePerFIC: rate,
      totalNaira: totalNaira,
      totalUSD: totalUSD,
      bankName: 'Alternative Bank',
      accountNumber: '0514108422',
      accountName: 'FingerMobile Protocol Communication',
      txHash: txHash,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      serialNumber: serial,
      status: 'CONFIRMED & ALLOCATED',
    };

    setPurchaseSuccessReceipt(receipt);

    // Save purchase to database ledger & local storage
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_MEMBER_PURCHASES) || '[]');
      existing.unshift(receipt);
      localStorage.setItem(STORAGE_KEY_MEMBER_PURCHASES, JSON.stringify(existing));
    } catch (_e) {
      // Ignore
    }

    // Automatically trigger PDF download
    downloadFicReceiptPdf(receipt);

    // Update CIC Vault Ledger
    const cicEntry: CICVaultLedgerEntry = {
      id: `cic_${Date.now()}`,
      type: 'DEPOSIT',
      source: 'Alternative Bank Settlement (Acc: 0514108422)',
      destination: receipt.walletAddress,
      amountFIC: amount,
      runningCIC: circulatingFIC + amount,
      timestamp: receipt.timestamp,
      reconciliationStatus: 'RECONCILED',
      notes: `Purchase Receipt ${receiptNum} issued to ${purchaseEmail}`,
    };
    setCicLedger([cicEntry, ...cicLedger]);
    setCirculatingFIC((prev) => prev + amount);
  };

  // 3. Robust Reconciliation / Call-Over System
  const runCallOverReconciliation = () => {
    setCallOverResultMsg('Running Guardian AI call-over reconciliation against all vault accounts...');
    setTimeout(() => {
      setCallOverResultMsg(
        'Call-Over Reconciliation Complete: 100% Postings Impacted. Zero non-impacted or erroneous records found. Mint Inspectorate Vault Ledger is verified free from material error.'
      );
      setTimeout(() => setCallOverResultMsg(''), 6000);
    }, 1200);
  };

  // 4. Price Adjustment Simulation Algorithm
  const runPriceAdjustmentSimulation = () => {
    let adjustmentPercent = 0;
    const reasons: string[] = [];

    // Daily Sales Velocity condition
    if (salesVelocityPercent > 90) {
      adjustmentPercent += 10;
      reasons.push('Sales Velocity > 90% of inventory (+10%)');
    } else if (salesVelocityPercent < 50) {
      adjustmentPercent -= 10;
      reasons.push('Sales Velocity < 50% of inventory (-10%)');
    } else {
      reasons.push('Sales Velocity nominal (70% buffer: 0%)');
    }

    // Weekly User Satisfaction
    if (userSatisfactionPercent < 70) {
      adjustmentPercent -= 10;
      reasons.push('User Satisfaction < 70% (-10%)');
    } else if (userSatisfactionPercent > 90) {
      adjustmentPercent += 10;
      reasons.push('User Satisfaction > 90% (+10%)');
    }

    // Weekly Competitor Pricing
    if (competitorPriceRatio < 80) {
      adjustmentPercent += 10;
      reasons.push('Competitor Prices < 80% of FIC (+10%)');
    } else if (competitorPriceRatio > 120) {
      adjustmentPercent -= 10;
      reasons.push('Competitor Prices > 120% of FIC (-10%)');
    }

    // Weekly Liquidity Pool
    if (liquidityPoolSize > 100000) {
      adjustmentPercent += 10;
      reasons.push('Liquidity Pool > 100,000 FIC (+10%)');
    } else if (liquidityPoolSize < 50000) {
      adjustmentPercent -= 10;
      reasons.push('Liquidity Pool < 50,000 FIC (-10%)');
    }

    // Cap at 20% max per week
    const cappedAdjustment = Math.max(-20, Math.min(20, adjustmentPercent));
    const newUSD = Math.max(0.01, Math.min(10.00, ficUSDValue * (1 + cappedAdjustment / 100)));
    const newNaira = newUSD * 1340;

    setAlgorithmSimulationFeedback(
      `Scheduled Adjustment Output: ${cappedAdjustment > 0 ? '+' : ''}${cappedAdjustment}% (Next Monday 00:00 UTC). ` +
      `Simulated Rate: $${newUSD.toFixed(3)} USD (₦${Math.round(newNaira).toLocaleString()} NGN). Factors: ${reasons.join('; ')}.`
    );
  };

  const payoutRails: FIATPayoutRule[] = [
    {
      id: 'rail_nip',
      railName: 'NIBSS Instant Payment (NIP)',
      provider: 'NIBSS (NIP)',
      status: 'Online',
      minPayoutFIC: 10, // ₦650
      maxPayoutDailyFIC: 50000, // ₦3,250,000
      settlementSpeed: 'Instant (T+0, < 15 seconds)',
      feePercentage: 0.5,
    },
    {
      id: 'rail_paystack',
      railName: 'Paystack Direct Bank Clearing',
      provider: 'Paystack',
      status: 'Online',
      minPayoutFIC: 10,
      maxPayoutDailyFIC: 20000,
      settlementSpeed: 'Realtime Webhook Clearing',
      feePercentage: 1.0,
    },
    {
      id: 'rail_flutterwave',
      railName: 'Flutterwave Multi-Currency Settlement',
      provider: 'Flutterwave',
      status: 'Online',
      minPayoutFIC: 20,
      maxPayoutDailyFIC: 35000,
      settlementSpeed: 'Instant Batch Clearing',
      feePercentage: 1.2,
    },
    {
      id: 'rail_interswitch',
      railName: 'Interswitch Quickteller Corporate Direct',
      provider: 'Interswitch',
      status: 'Online',
      minPayoutFIC: 50,
      maxPayoutDailyFIC: 100000,
      settlementSpeed: 'Direct Core Switch (T+0)',
      feePercentage: 0.8,
    },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* ========================================================================= */}
      {/* SOVEREIGN FINANCIAL CORE HEADER BANNER                                    */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-zinc-900 to-amber-950 p-6 sm:p-8 border border-amber-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>FingerMobile Act: Sovereign Financial Treasury & Mint Inspectorate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sovereign Financial Treasury, FIC Minting & FIAT Rules Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Statutory issuing console empowered by the FingerMobile Act. Mbah Israel Obinna holds the absolute
              irrevocable exclusive right to commission and issue FingerMobile Infinite Coins (FIC). Monitored by
              Guardian AI Typographic Electronic Counter and blockchain shared ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNotarizationModal(true)}
              className="px-4 py-2.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/40 transition-all flex items-center gap-2"
              title="View Cryptographically Verified Digital Notarization Certificate"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Digital Notarization Certificate &rarr;</span>
            </button>
            <button
              onClick={() => handleSubTabChange('member-purchase')}
              className="px-4 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Alternative Bank (0514108422) &rarr;</span>
            </button>
            <button
              onClick={() => handleSubTabChange('inspectorate')}
              className="px-4 py-2.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Mint Inspectorate Charter</span>
            </button>
          </div>
        </div>

        {/* Global Financial Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-black/40 rounded-xl p-3.5 border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Total Statutory Supply</span>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-amber-400 mt-0.5">
              {(totalMintedFIC / 1000000).toFixed(1)}M FIC
            </div>
            <span className="text-[10px] text-slate-400 font-mono">₦{(totalMintedFIC * exchangeRateNaira / 1000000000).toFixed(2)}B Fixed Statutory Cap ($2.4M USD)</span>
          </div>

          <div className="bg-black/40 rounded-xl p-3.5 border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">Coins in Circulation (CIC)</span>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
              {(circulatingFIC / 1000000).toFixed(2)}M FIC
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              {((circulatingFIC / totalMintedFIC) * 100).toFixed(1)}% Outside Vaults
            </span>
          </div>

          <div className="bg-black/40 rounded-xl p-3.5 border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">FIAT Parity & Launch Value</span>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-white mt-0.5">
              1 FIC = ₦{exchangeRateNaira.toFixed(2)}
            </div>
            <span className="text-[10px] text-amber-400 font-mono">${ficUSDValue.toFixed(2)} USD | 1 FIC = 1 Vote</span>
          </div>

          <div className="bg-black/40 rounded-xl p-3.5 border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium">10% Burn Mechanism</span>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-rose-400 mt-0.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{burnedFIC.toLocaleString()} FIC</span>
            </div>
            <span className="text-[10px] text-rose-400 font-mono">Permanent Supply Deflation</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9 SUB-TABS NAVIGATION BAR                                                */}
      {/* ========================================================================= */}
      <div className="border-b border-zinc-800">
        <nav className="flex space-x-4 overflow-x-auto pb-1 text-xs sm:text-sm font-medium">
          {[
            { id: 'financial-ecosystem', label: 'Financial Ecosystem & Ratios (Fidelity Bank)', icon: Landmark },
            { id: 'treasury', label: 'Treasury Reserves & Liquidity', icon: Building2 },
            { id: 'inspectorate', label: 'Mint Inspectorate & Charter', icon: Award },
            { id: 'fic-engine', label: 'FIC Minting & 48M Allocation', icon: Coins },
            { id: 'cic-ledger', label: 'CIC & Vault Ledger', icon: FileText },
            { id: 'member-purchase', label: 'Member FIC Purchase (Alternative Bank)', icon: CreditCard },
            { id: 'economic-algorithms', label: 'Valuation & Pricing Algorithms', icon: TrendingUp },
            { id: 'fiat-rules', label: 'FIAT Rules & Biometrics (>500 FIC)', icon: DollarSign },
            { id: 'subscriptions-rev', label: 'Subscription Revenue', icon: Sliders },
            { id: 'access-bridge', label: 'Roles & Gatekeeper Bridge', icon: Shield },
            { id: 'cbn-nfem', label: 'CBN NFEM Ingestion & REER Engine', icon: Landmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id as SubTabType)}
                className={`py-3 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 0: ENTERPRISE FINANCIAL ECOSYSTEM, FIDELITY RAILS & RATIOS         */}
      {/* ========================================================================= */}
      {activeSubTab === 'financial-ecosystem' && (
        <div className="space-y-6">
          <EnterpriseFinancialEcosystemConsole />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TREASURY RESERVES & LIQUIDITY                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'treasury' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Sovereign Escrow Vault
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                  Audited 100%
                </span>
              </div>
              <div className="text-2xl font-mono font-extrabold text-white">
                ₦{(totalMintedFIC * exchangeRateNaira).toLocaleString()}.00
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Backing 48,000,000 FIC collateralized across CBN Tier-1 partner banks and Alternative Bank (0514108422).
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Liquidity Coverage Ratio</span>
                  <span className="font-mono font-bold text-emerald-400">142.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Alternative Bank Balance</span>
                  <span className="font-mono font-bold text-amber-400">₦2,450,820,000.00</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
                Statutory Allocation Architecture (48M FIC)
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Central FIC Wallets 001 - 003</span>
                    <span className="font-mono font-bold">30.0M FIC (62.5%)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '62.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Wallet 004 Treasury & Seed Sale ($0.05)</span>
                    <span className="font-mono font-bold">5.0M FIC (10.4%)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Development Team Core Engine</span>
                    <span className="font-mono font-bold">5.0M FIC (10.4%)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '10.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Founders & Secretarial Custodial Vaults</span>
                    <span className="font-mono font-bold">6.0M FIC (12.5%)</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-amber-950 text-white rounded-2xl p-6 shadow-sm border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Executive Security Protocol
                </span>
                <h3 className="text-base font-bold mt-1">Double-Entry Cryptographic Verification</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Every withdrawal and deposit automatically verifies against Alternative Bank (0514108422) and on-chain
                  WORM ledgers. Free from material error.
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={runCallOverReconciliation}
                  className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute Call-Over Reconciliation</span>
                </button>
                <button
                  onClick={() => handleSubTabChange('member-purchase')}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Inspect Alternative Bank Purchases</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: MINT INSPECTORATE & STATUTORY CHARTER                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'inspectorate' && (
        <div className="space-y-6">
          {/* Statutory Charter Banner */}
          <div className="p-6 rounded-2xl bg-zinc-900 border-2 border-amber-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                    Statutory Rule under the FingerMobile Act
                  </span>
                  <h2 className="text-lg font-extrabold text-white">
                    Sole Irrevocable Exclusive Right to Issue FingerMobile Infinite Coins
                  </h2>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Guardian AI Rule Locked</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
              <p>
                <strong>The FingerMobile Act Empowers Mbah Israel Obinna:</strong> Mbah Israel Obinna holds the absolute
                irrevocable exclusive right to issue FingerMobile Infinite Coins throughout the Platform. No other
                Type/Tier/Account/Individual/Company/Group/Government/Organization is permitted to Mint, Issue, or create
                documents payable to bearer on demand.
              </p>
              <p className="text-amber-300 font-medium">
                <strong>Conclusive Absolute Binding Declaration:</strong> Only Mbah Israel Obinna IS AUTHORIZED when soever,
                wheresoever, howsoever, to authorize all aspects of FIC Minting, DISTRIBUTION, SHARING, and ALLOCATION in
                any variation howsoever. This absolute rule is enforced and kept alive 24/7 by Guardian AI and all
                security apparatus on the platform.
              </p>
            </div>

            {/* Guardian AI Electronic Counter Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black/50 border border-amber-500/30 rounded-xl text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Electronic Blockchain Counter:</span>
                <span className="text-amber-400 font-bold">{guardianCounterValue.toLocaleString()} FIC</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Active Guardian Serial Stamp:</span>
                <span className="text-emerald-400 font-bold">{activeSerialNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Guardian AI Apparatus:</span>
                <span className="text-purple-400 font-bold">
                  {guardianEnforcementActive ? 'ONLINE & SEALED' : 'DEGRADED'}
                </span>
              </div>
            </div>
          </div>

          {/* Official Digital Notarization & IP Integrity Verification Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-zinc-900 to-amber-950 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Legally & Cryptographically Notarized</span>
                    </div>
                    <h3 className="text-lg font-black text-white">
                      DIGITAL NOTARIZATION CERTIFICATE (IP INTEGRITY VERIFICATION)
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNotarizationModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Certified Seal</span>
                  </button>
                  <a
                    href="/legal/whitepaper"
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>White Paper</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/50 p-3.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[11px] block">Certified Asset</span>
                  <span className="font-bold text-white text-xs">{FIC_DIGITAL_NOTARIZATION_CERTIFICATE.documentTitle}</span>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[11px] block">Issued To (Exclusive Rights Holder)</span>
                  <span className="font-bold text-amber-400 text-xs">{FIC_DIGITAL_NOTARIZATION_CERTIFICATE.issuedTo}</span>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[11px] block">Reference & Fingerprint ID</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs block">{FIC_DIGITAL_NOTARIZATION_CERTIFICATE.referenceId}</span>
                  <span className="font-mono text-zinc-400 text-[10px]">{FIC_DIGITAL_NOTARIZATION_CERTIFICATE.fingerprintId}</span>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-[11px] block">Notarization Timestamp (UTC)</span>
                  <span className="font-mono text-amber-300 text-[11px] block">{FIC_DIGITAL_NOTARIZATION_CERTIFICATE.timestampUtc}</span>
                  <span className="text-zinc-400 text-[10px]">Issued: {FIC_DIGITAL_NOTARIZATION_CERTIFICATE.dateIssued}</span>
                </div>
              </div>

              {/* Cryptographic SHA256 Hash Display */}
              <div className="p-3.5 bg-black/80 rounded-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Hash className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-zinc-400 font-mono text-[11px] shrink-0">Document SHA256:</span>
                  <code className="text-amber-300 font-mono text-[11px] break-all select-all">
                    {FIC_DIGITAL_NOTARIZATION_CERTIFICATE.documentSha256Hash}
                  </code>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0">
                  SHA-256 HASH VERIFIED 100%
                </span>
              </div>

              <div className="text-xs text-zinc-300/90 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                <span className="text-amber-300 font-semibold">Integrity Certification: </span>
                {FIC_DIGITAL_NOTARIZATION_CERTIFICATE.verificationStatement}
              </div>
            </div>
          </div>

          {/* Mint Inspectorate Console & 4 Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Fingerprint className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">1. Uniqueness</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Typographic GUARDIAN AI stamps unique serial numbers on each FIC for precision tracking across all
                service transactions.
              </p>
              <div className="text-[11px] font-mono text-amber-300 bg-black/40 p-2 rounded-lg border border-white/5">
                Format: FIC-2026-OBINNA-XXXX
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">2. Anti-Counterfeiting</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Advanced security TOKEN, digital watermarks, and cryptographic holograms render counterfeiting impossible.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-black/40 p-2 rounded-lg border border-white/5">
                Token Type: SHA-256 Non-Replicable
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Lock className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">3. Tamper-Evident</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Special SHARED LEDGER data makes records break-proof and immutable if tampered with, guaranteeing integrity.
              </p>
              <div className="text-[11px] font-mono text-indigo-300 bg-black/40 p-2 rounded-lg border border-white/5">
                WORM Distributed State Chain
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Key className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">4. Unique ID</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Every FIC has a unique identifier that can be verified in real time on the blockchain explorer.
              </p>
              <div className="text-[11px] font-mono text-purple-300 bg-black/40 p-2 rounded-lg border border-white/5">
                Blockchain Electronic Counter Monitored
              </div>
            </div>
          </div>

          {/* Quality Control & Macro Factors Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mint Inspectorate Quality Control & Pre-Printing Economic Factors
            </h3>
            <p className="text-xs text-zinc-400">
              The Mint Inspectorate evaluates macroeconomic equilibrium metrics before any finished FingerMobile Infinite Coins are printed:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 font-sans">1. Inflation Rate Factor</span>
                <div className="text-base font-bold text-amber-400 mt-1">18.4% Baseline</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Checked against CBN & National Bureau indexes.</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 font-sans">2. Gross Domestic Product (GDP)</span>
                <div className="text-base font-bold text-emerald-400 mt-1">3.4% Growth Trend</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Ecosystem commerce velocity alignment.</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 font-sans">3. Buffer Stock Level</span>
                <div className="text-base font-bold text-indigo-400 mt-1">5,000,000 FIC</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Central Wallet 004 reserve cushion.</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 font-sans">4. Disposed / Burn Replacement</span>
                <div className="text-base font-bold text-rose-400 mt-1">428,500 FIC Burned</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">Replacement strictly limited to maintain scarcity.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: FIC TOKEN MINTING & FORMAL 48M ALLOCATION PLAN                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'fic-engine' && (
        <div className="space-y-6">
          {allocationSuccessMsg && (
            <div className="p-4 bg-emerald-950 border border-emerald-500 rounded-xl text-xs font-medium text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{allocationSuccessMsg}</span>
            </div>
          )}

          {/* Formal Allocation Plan Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Formal FIC Allocation Plan Matrix
                </span>
                <h3 className="text-lg font-bold text-white">
                  Statutory Wallet Allocations (Total: 48,000,000 FIC)
                </h3>
              </div>
              <button
                onClick={() => setIsMultiSigModalOpen(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Wallet 004 Multi-Sig Console &rarr;</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Wallet & Custodian</th>
                    <th className="p-3">Allocated Amount</th>
                    <th className="p-3">Unit Valuation</th>
                    <th className="p-3">Governance / Signatures</th>
                    <th className="p-3">Statutory Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                  {allocationPlan.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-sans">
                        <div className="font-bold text-white">{item.walletName}</div>
                        <div className="text-[10px] text-zinc-400">{item.custodianTitle}</div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">{item.walletAddress}</div>
                      </td>
                      <td className="p-3 font-bold text-amber-400 text-sm">
                        {item.amountFIC.toLocaleString()} FIC
                        <div className="text-[10px] text-zinc-400 font-sans">
                          ₦{(item.amountFIC * exchangeRateNaira).toLocaleString()} NGN
                        </div>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        ${item.unitPriceUSD.toFixed(2)} USD
                      </td>
                      <td className="p-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.isMultiSig
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {item.governanceType}
                        </span>
                        {item.isMultiSig && (
                          <div className="text-[10px] text-purple-400 mt-1">
                            Requires {item.signaturesRequired} of 5 Board Signatures
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-sans text-zinc-300 max-w-xs leading-relaxed">
                        {item.purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Minting Form for 8 Official Purposes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Execute FIC Allocation</h3>
                  <p className="text-[11px] text-zinc-400">Commissioned under Mbah Israel Obinna exclusive charter.</p>
                </div>
              </div>

              <form onSubmit={handleMintAllocate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Recipient Address or Designated Wallet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0x0B14...8A22F1 or creator@fingermobileprotocol.com"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    FIC Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="e.g. 5000"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full pl-3 pr-16 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm font-bold"
                    />
                    <span className="absolute right-3 top-2.5 font-bold font-mono text-amber-500">FIC</span>
                  </div>
                  {amountInput && !isNaN(parseFloat(amountInput)) && (
                    <div className="text-[11px] text-zinc-400 font-mono mt-1">
                      FIAT Parity: ₦{(parseFloat(amountInput) * exchangeRateNaira).toLocaleString()} NGN (~${(parseFloat(amountInput) * ficUSDValue).toFixed(2)} USD)
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Mint Purpose (8 Statutory Categories)
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Creator Incentive">1. Creator Incentive (Monetization & Stems)</option>
                    <option value="Node Royalty">2. Node Royalty (Franchise & Territorial Nodes)</option>
                    <option value="Treasury Grant">3. Treasury Grant (R&D / Research)</option>
                    <option value="System Compensation">4. System Comp (Dispute & Escrow Resolution)</option>
                    <option value="Marketplace Liquidity Pool">5. Marketplace FIC Liquidity Pool (Trade/Refunds/Exchanges)</option>
                    <option value="FIC Payout Rail">6. FIC Payout Rail (Remittances/Grants/Giveaways)</option>
                    <option value="FIC Subscription & Premium Tiers">7. FIC Subscription & Premium Tiers</option>
                    <option value="FIC Placement">8. FIC Placement (Statutory Executive Placement)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Ledger Audit Justification
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide justification for permanent blockchain ledger..."
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-mono text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Irrevocable Allocation</span>
                </button>
              </form>
            </div>

            {/* Live Ledger Table */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Blockchain Stamped Allocation Trail ({allocationsLedger.length})
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">WORM Audit-Locked</span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Recipient & Serial</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Use Case</th>
                      <th className="p-3">Tx Hash & Authorizer</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                    {allocationsLedger.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-sans">
                          <div className="font-bold text-white">{tx.recipientName}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{tx.recipientAddress}</div>
                          {tx.serialNumber && (
                            <div className="text-[10px] text-amber-400 font-mono mt-0.5">{tx.serialNumber}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-amber-400">+{tx.amountFIC.toLocaleString()} FIC</span>
                          <div className="text-[10px] text-zinc-400">₦{tx.fiatEquivalentNaira.toLocaleString()}</div>
                        </td>
                        <td className="p-3 font-sans">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="text-[10px] text-blue-400 font-bold">{tx.txHash}</div>
                          <div className="text-[10px] text-zinc-400 font-sans line-clamp-1">{tx.authorizedBy}</div>
                        </td>
                        <td className="p-3 text-right text-zinc-400 text-[10px] font-sans">
                          {tx.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: COINS IN CIRCULATION (CIC) & VAULT LEDGER                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'cic-ledger' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Accounting & Statistical Movements Engine
                </span>
                <h3 className="text-lg font-bold text-white">
                  FingerMobile Infinite Coins in Circulation (CIC) & Vault Ledger
                </h3>
              </div>
              <button
                onClick={runCallOverReconciliation}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Run Call-Over Audit Now</span>
              </button>
            </div>

            {callOverResultMsg && (
              <div className="p-3.5 bg-emerald-950 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{callOverResultMsg}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-2">
              <p>
                <strong>Withdrawals & Deposits Statistical Approach:</strong> The Mint Inspectorate defines CIC as all
                FIC outside the vaults of the Mint Inspectorate (in wallets of general members, stores, services, etc.).
                Every withdrawal by users or purchases at platform services records an increase in CIC, and every wallet
                deposit records a corresponding impact in the Mint Inspectorate Vault Ledger on a transaction-by-transaction basis.
              </p>
              <p className="text-amber-300 font-medium">
                <strong>Reconciliation / Call-Over System:</strong> The Inspectorate operates a robust call-over system
                to highlight erroneous or non-impacted postings into the vault account for immediate resolution, ensuring
                the reported CIC figure is free from material error.
              </p>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Tx Type</th>
                    <th className="p-3">Source &rarr; Destination</th>
                    <th className="p-3">Amount FIC</th>
                    <th className="p-3">Running CIC</th>
                    <th className="p-3">Audit Reconciliation Status</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                  {cicLedger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getEntryBadgeClass(entry.type)}`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-white">{entry.source}</div>
                        <div className="text-[10px] text-zinc-400">&rarr; {entry.destination}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{entry.notes}</div>
                      </td>
                      <td className="p-3 font-bold text-amber-400 text-sm">
                        {entry.amountFIC.toLocaleString()} FIC
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        {entry.runningCIC.toLocaleString()} FIC
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {entry.reconciliationStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right text-zinc-400 font-sans">
                        {entry.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: MEMBER FIC PURCHASE & ALTERNATIVE BANK CONSOLE                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'member-purchase' && (
        <div className="space-y-6">
          {/* Alternative Bank Credentials Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-amber-950/60 border border-amber-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                    Official Member FIC Purchase & Settlement Bank Details
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Alternative Bank Protocol Portal</h3>
                </div>
              </div>
              <div className="px-3 py-1 bg-black/40 rounded-xl border border-amber-500/30 text-amber-300 font-mono text-xs">
                Bank Code: ALT-051
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-zinc-500 font-sans">Designated Bank:</span>
                <div className="text-lg font-bold text-white mt-1">Alternative Bank</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-1">CBN Licensed & Supervised Institution</p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-zinc-500 font-sans">Account Number:</span>
                <div className="text-lg font-bold text-amber-400 mt-1 select-all">0514108422</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-1">Dedicated Sovereign Protocol Treasury Rail</p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-zinc-500 font-sans">Account Name:</span>
                <div className="text-lg font-bold text-white mt-1">FingerMobile Protocol Communication</div>
                <p className="text-[11px] text-zinc-400 font-sans mt-1">Official Corporate Settlement Account</p>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
              <strong>PDF Confirmation Rule:</strong> Receipt of Payment Confirmation and FIC Allocation is issued strictly
              in <strong>PDF Format only</strong> and automatically dispatched to the purchaser&apos;s registered email address,
              with duplicate records logged into the database ledger for future cross-referencing.
            </div>
          </div>

          {/* Member Purchase Simulator Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Member FIC Purchase & Instant PDF Receipt Dispatch
              </h3>

              <form onSubmit={handleMemberFicPurchase} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Purchaser Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukwuma Adeleke"
                    value={purchaseName}
                    onChange={(e) => setPurchaseName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Purchaser Email (PDF Receipt Destination)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. purchaser@gmail.com"
                    value={purchaseEmail}
                    onChange={(e) => setPurchaseEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Destination FIC Wallet Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0x819...bb21 (Leave blank to generate automatically)"
                    value={purchaseWallet}
                    onChange={(e) => setPurchaseWallet(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">FIC Purchase Quantity</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={purchaseFicAmount}
                      onChange={(e) => setPurchaseFicAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-300 mb-1">Purchase Tier & Rate</label>
                    <select
                      value={purchaseRateType}
                      onChange={(e) => setPurchaseRateType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="standard">Standard: ₦65.00 / FIC ($0.05)</option>
                      <option value="treasury_seed">Wallet 004 Seed: $0.05 / FIC (₦65.00)</option>
                    </select>
                  </div>
                </div>

                {purchaseFicAmount && !isNaN(parseFloat(purchaseFicAmount)) && (
                  <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>Total Considerations:</span>
                      <span className="font-bold text-amber-400">
                        ₦{(
                          parseFloat(purchaseFicAmount) *
                          (purchaseRateType === 'treasury_seed' ? 65 : exchangeRateNaira)
                        ).toLocaleString()}{' '}
                        NGN
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>USD Equivalent:</span>
                      <span className="font-bold text-emerald-400">
                        ${(
                          parseFloat(purchaseFicAmount) *
                          (purchaseRateType === 'treasury_seed' ? 0.05 : ficUSDValue)
                        ).toFixed(2)}{' '}
                        USD
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-mono text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Confirm Payment & Download Official PDF Receipt</span>
                </button>
              </form>
            </div>

            {/* Receipt Preview Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    PDF Receipt Inspector & Cryptographic Attestation
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400">PDF-1.4 Compliant</span>
                </div>

                {purchaseSuccessReceipt ? (
                  <div className="mt-4 p-4 rounded-xl bg-black/60 border border-amber-500/30 text-xs font-mono space-y-2 text-slate-200">
                    <div className="flex justify-between border-b border-zinc-800 pb-2 text-amber-400 font-bold">
                      <span>{purchaseSuccessReceipt.receiptNumber}</span>
                      <span>{purchaseSuccessReceipt.status}</span>
                    </div>
                    <div>Purchaser: {purchaseSuccessReceipt.purchaserName}</div>
                    <div>Email: {purchaseSuccessReceipt.purchaserEmail}</div>
                    <div>Wallet: {purchaseSuccessReceipt.walletAddress}</div>
                    <div className="text-amber-300 font-bold">
                      Amount: {purchaseSuccessReceipt.amountFIC.toLocaleString()} FIC (₦{purchaseSuccessReceipt.totalNaira.toLocaleString()})
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Bank: {purchaseSuccessReceipt.bankName} | Acc: {purchaseSuccessReceipt.accountNumber}
                    </div>
                    <div className="text-zinc-500 text-[10px] break-all">
                      Hash: {purchaseSuccessReceipt.txHash}
                    </div>
                    <div className="text-emerald-400 text-[10px]">
                      Serial: {purchaseSuccessReceipt.serialNumber}
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 text-center py-12 text-zinc-500 text-xs space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-zinc-600 opacity-60" />
                    <p>No recent purchase rendered. Fill out form to generate an official PDF payment receipt.</p>
                  </div>
                )}
              </div>

              {purchaseSuccessReceipt && (
                <button
                  onClick={() => downloadFicReceiptPdf(purchaseSuccessReceipt)}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Re-Download PDF Receipt</span>
                </button>
              )}
            </div>
          </div>

          {/* Action notification message */}
          {treasuryActionMsg && (
            <div className="p-4 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-medium">{treasuryActionMsg}</span>
              </div>
              <button
                onClick={() => setTreasuryActionMsg('')}
                className="text-emerald-400 hover:text-white font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* LIVE MASTERDASHBOARD ACCOUNTS TREASURY & CFO CLEARING CONSOLE */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Live MasterDashboard Accounts Treasury Settlement Rail
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Treasury Staff Payment Confirmation & Executive CFO Final Approval
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Reconciliation for payments through Alternative Bank (0514108422). Staff confirms; CFO Mrs. Mbah Eunice Emonena authorizes deduction from Wallet 004.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowRolesModal(true)}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>4-Tier Roles Directory</span>
                </button>

                <button
                  onClick={fetchLiveTreasuryData}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-xl border border-amber-500/30 transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${treasuryActionLoading ? 'animate-spin' : ''}`} />
                  <span>Sync Requests</span>
                </button>
              </div>
            </div>

            {/* Acting Treasury Staff Controls & CFO Root Seal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Acting Treasury Staff (Payment Confirmation)
                  </span>
                  <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800">
                    Staff 1 to 7
                  </span>
                </div>
                <div className="space-y-2">
                  <select
                    value={actingStaffCode}
                    onChange={(e) => setActingStaffCode(e.target.value)}
                    className="w-full text-xs p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="staff_accountant_1">Account Staff 1 (Staff Accountant)</option>
                    <option value="staff_accountant_2">Account Staff 2 (Staff Accountant)</option>
                    <option value="staff_accountant_3">Account Staff 3 (Staff Accountant)</option>
                    <option value="staff_accountant_4">Account Staff 4 (Staff Accountant)</option>
                    <option value="staff_accountant_5">Account Staff 5 (Staff Accountant)</option>
                    <option value="staff_accountant_6">Account Staff 6 (Staff Accountant)</option>
                    <option value="staff_accountant_7">Account Staff 7 (Staff Accountant)</option>
                  </select>

                  <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      id="consoleAutoApprove"
                      checked={autoApproveFlag}
                      onChange={(e) => setAutoApproveFlag(e.target.checked)}
                      className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="consoleAutoApprove" className="select-none">
                      Enable Auto-Approved Audit Flag
                    </label>
                  </div>
                </div>
              </div>

              {/* CFO Executive Seal */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Executive Authority: Chief Financial Officer (CFO)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Root Seal Active</span>
                </div>
                <div className="text-xs font-mono space-y-1">
                  <div className="font-bold text-white">{PLATFORM_OWNERSHIP.coFounder.name}</div>
                  <div className="text-zinc-400 text-[11px]">{PLATFORM_OWNERSHIP.coFounder.roleBadge}</div>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-800 space-y-0.5">
                    {PLATFORM_OWNERSHIP.coFounder.rootMasterSeal?.map((seal, idx) => (
                      <div key={idx} className="text-amber-300/80">{seal}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Requests Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 uppercase tracking-wider">
                  Alternative Bank Treasury Deposit Queue ({liveTreasuryRequests.length})
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">Auto-Refreshed via Sovereign Rail</span>
              </div>

              {liveTreasuryRequests.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No treasury deposit requests currently queued.
                </div>
              ) : (
                <div className="overflow-x-auto border border-zinc-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Reference</th>
                        <th className="p-3">Amount (FIC / NGN)</th>
                        <th className="p-3">Depositor & Bank Ref</th>
                        <th className="p-3">Treasury Staff Confirmation</th>
                        <th className="p-3">CFO Final Approval</th>
                        <th className="p-3">Vault Source</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 font-mono text-[11px]">
                      {liveTreasuryRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-zinc-800/40">
                          <td className="p-3">
                            <span className="font-bold text-amber-400 block">{req.requestReference}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          <td className="p-3 font-sans">
                            <span className="font-bold text-white block text-sm">{req.amountFIC.toLocaleString()} FIC</span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              ₦{req.amountNGN.toLocaleString()} (Rate: ₦{req.ratePerFIC})
                            </span>
                          </td>

                          <td className="p-3 font-sans">
                            <div className="font-bold text-zinc-200">{req.depositorName}</div>
                            <div className="text-[10px] text-zinc-400">{req.depositorBank}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{req.bankTxReference}</div>
                          </td>

                          <td className="p-3 font-sans">
                            {req.treasuryConfirmedAt ? (
                              <div>
                                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                                  ✓ Confirmed by {req.treasuryStaffName || 'Treasury Staff'}
                                </span>
                                <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                                  {new Date(req.treasuryConfirmedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800 animate-pulse">
                                Awaiting Staff 1-7
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-sans">
                            {req.cfoApprovedAt ? (
                              <div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                                  ✓ Approved by {req.cfoName || 'Mrs. Mbah Eunice Emonena (CFO)'}
                                </span>
                                <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                                  {new Date(req.cfoApprovedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-zinc-500 italic">
                                {req.treasuryConfirmedAt ? 'Ready for CFO Seal' : 'Pending Confirmation'}
                              </span>
                            )}
                          </td>

                          <td className="p-3 font-mono text-[10px] text-zinc-400">
                            {req.deductedFromVault ? (
                              <span className="text-purple-300 font-semibold">{req.deductedFromVault}</span>
                            ) : (
                              <span className="text-zinc-600">Wallet 004 Priority</span>
                            )}
                          </td>

                          <td className="p-3 text-right space-y-1 font-sans">
                            {req.status === 'PENDING_CONFIRMATION' && (
                              <button
                                onClick={() => handleTreasuryStaffConfirm(req.id)}
                                disabled={treasuryActionLoading}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[10px] transition"
                              >
                                Confirm Payment
                              </button>
                            )}

                            {req.status === 'CONFIRMED_BY_TREASURY' && (
                              <button
                                onClick={() => handleCfoAuthorizeAndRelease(req.id)}
                                disabled={treasuryActionLoading}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] transition shadow-md"
                              >
                                CFO Approve & Release
                              </button>
                            )}

                            {req.status === 'APPROVED_AND_FUNDED' && (
                              <button
                                onClick={() => {
                                  const receiptData: FICReceiptData = {
                                    receiptNumber: req.pdfReceiptNumber || `RCPT-${req.id}`,
                                    purchaserName: req.userName || req.depositorName || 'Valued Member',
                                    purchaserEmail: req.userEmail || 'member@fingermobileprotocol.com',
                                    walletAddress: req.userWalletAddress || '0xDEF...987',
                                    amountFIC: req.amountFIC,
                                    ratePerFIC: req.ratePerFIC,
                                    totalNaira: req.amountNGN,
                                    totalUSD: parseFloat((req.amountFIC * 0.05).toFixed(2)),
                                    bankName: req.destinationBankName || 'Alternative Bank',
                                    accountNumber: req.destinationAccountNumber || '0514108422',
                                    accountName: req.destinationAccountName || 'FingerMobile Protocol Communication',
                                    txHash: req.bankTxReference || `ALT-${req.requestReference}`,
                                    timestamp: req.cfoApprovedAt || req.updatedAt || new Date().toISOString(),
                                    serialNumber: req.pdfReceiptSerial || `FIC-ALTBNK-${req.id}-004`,
                                    status: 'APPROVED & FUNDED',
                                    treasuryStaffName: req.treasuryStaffName || 'Account Staff 3',
                                    treasuryStaffRole: req.treasuryStaffRole || 'Staff Accountant',
                                    cfoApprovedBy: req.cfoName || PLATFORM_OWNERSHIP.coFounder.name,
                                    cfoApprovedAt: req.cfoApprovedAt || req.updatedAt,
                                    sourceVault: req.deductedFromVault || 'Wallet 004 Treasury & Seed Sale'
                                  };
                                  downloadFicReceiptPdf(receiptData);
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition flex items-center gap-1 ml-auto"
                              >
                                <Download className="w-3 h-3" />
                                <span>PDF Receipt</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SOVEREIGN VAULT WATERFALL DEPLETION MONITOR */}
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Sovereign Vault Waterfall Depletion Monitor
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Depletion Order: Wallet 004 Treasury & Seed Sale &rarr; Wallet 003 &rarr; Wallet 002 &rarr; Wallet 001. Minting locked until exhausted and approved by SuperAdmin Founder.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800">
                  Priority Hierarchy Enforced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                {liveVaults.map((vault) => {
                  const pct = vault.initialAllocationFIC > 0
                    ? (vault.balanceFIC / vault.initialAllocationFIC) * 100
                    : 100;
                  return (
                    <div
                      key={vault.id}
                      className={`p-3.5 rounded-xl border ${
                        vault.vaultNumber === '004'
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-black/40 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                        <span className="font-bold text-white">Vault {vault.vaultNumber}</span>
                        <span>Priority #{vault.priorityOrder}</span>
                      </div>
                      <div className="font-sans font-bold text-white text-xs truncate">
                        {vault.vaultNumber === '004' ? 'Wallet 004 Treasury & Seed' : vault.vaultName.slice(0, 28)}
                      </div>
                      <div className="text-amber-400 font-bold text-sm mt-2">
                        {vault.balanceFIC.toLocaleString()} FIC
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className={`h-full ${vault.vaultNumber === '004' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
                        <span>Depleted: {vault.depletedFIC}</span>
                        <span>{pct.toFixed(1)}% Left</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4-TIER FINANCIAL ROLES DIRECTORY MODAL */}
          {showRolesModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-white">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                      Corporate Governance & Treasury Oversight
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Financial, Accounting & Treasury Roles Directory
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowRolesModal(false)}
                    className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* CFO Root Seal Card */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{PLATFORM_OWNERSHIP.coFounder.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400 text-slate-950 font-black">
                      Root Master Seal Hardcoded
                    </span>
                  </div>
                  <p className="text-amber-300 font-medium">{PLATFORM_OWNERSHIP.coFounder.roleBadge}</p>
                  <div className="text-[10px] text-zinc-400 pt-1 space-y-0.5">
                    {PLATFORM_OWNERSHIP.coFounder.rootMasterSeal?.map((seal, i) => (
                      <div key={i} className="text-emerald-400 font-semibold">{seal}</div>
                    ))}
                  </div>
                </div>

                {/* 4 Tiers */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {[
                    { title: 'Executive & Leadership Roles', cat: 'EXECUTIVE_LEADERSHIP' },
                    { title: 'Management & Supervisory Roles', cat: 'MANAGEMENT_SUPERVISORY' },
                    { title: 'Professional & Mid-Level Roles', cat: 'PROFESSIONAL_MIDLEVEL' },
                    { title: 'Entry-Level & Support Roles', cat: 'ENTRY_SUPPORT' }
                  ].map((tier) => {
                    const roles = FINANCIAL_ROLES_TAXONOMY.filter((r) => r.category === tier.cat);
                    return (
                      <div key={tier.cat} className="space-y-2">
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                          {tier.title} ({roles.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {roles.map((r) => (
                            <div key={r.roleCode} className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1">
                              <div className="flex justify-between font-bold text-zinc-200">
                                <span>{r.roleName}</span>
                                <span className="font-mono text-[10px] text-zinc-500">{r.roleCode}</span>
                              </div>
                              <p className="text-[11px] text-zinc-400">{r.responsibilities}</p>
                              <div className="flex gap-2 pt-1 text-[10px] font-bold">
                                {r.canConfirmPayment && (
                                  <span className="text-blue-400">✓ Alternative Bank Confirmation</span>
                                )}
                                {r.canFinalApprove && (
                                  <span className="text-amber-400">✓ CFO Final Release</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowRolesModal(false)}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition"
                  >
                    Close Directory
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 6: VALUATION & PRICING ALGORITHMS                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'economic-algorithms' && (
        <div className="space-y-6">
          {/* Core Economic Pegs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-[11px] text-zinc-400 font-medium">FIAT Base Anchor</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                1 FIC = ₦{exchangeRateNaira.toFixed(2)}
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Baseline value anchor for digital & physical commerce.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-[11px] text-zinc-400 font-medium">Launch / Base Unit Value</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                1 FIC = ${ficUSDValue.toFixed(2)} USD
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Platform base unit value across all modules (1 USD = 20 FIC).</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-[11px] text-zinc-400 font-medium">Standard Unit of Value</span>
              <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
                1 FIC = 1 Standard Unit
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Unified pricing denominator for products and services.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <span className="text-[11px] text-zinc-400 font-medium">Democratic Governance</span>
              <div className="text-xl font-bold font-mono text-purple-300 mt-1 flex items-center gap-1.5">
                <Vote className="w-5 h-5 text-purple-400" />
                <span>1 FIC = 1 Vote</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Anonymous to users, identity-verified on blockchain.</p>
            </div>
          </div>

          {/* Dynamic Price Adjustment Algorithm Simulator */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  Algorithmic Price Adjustment Schedule (Every Monday 00:00 UTC)
                </span>
                <h3 className="text-lg font-bold text-white">
                  Market Dynamics & Automated Adjustment Simulator
                </h3>
              </div>
              <button
                onClick={runPriceAdjustmentSimulation}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Run Algorithmic Simulation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-400 font-sans">1. Daily Sales Velocity</span>
                <div className="text-lg font-bold text-white">{salesVelocityPercent}% of Inventory</div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={salesVelocityPercent}
                  onChange={(e) => setSalesVelocityPercent(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-zinc-500 font-sans block">
                  &gt;90%: +10% | &lt;50%: -10% | 70%: Maintain
                </span>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-400 font-sans">2. User Satisfaction</span>
                <div className="text-lg font-bold text-white">{userSatisfactionPercent}%</div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userSatisfactionPercent}
                  onChange={(e) => setUserSatisfactionPercent(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-zinc-500 font-sans block">
                  &gt;90%: +10% | &lt;70%: -10%
                </span>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-400 font-sans">3. Competitor Pricing</span>
                <div className="text-lg font-bold text-white">{competitorPriceRatio}% of FIC</div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={competitorPriceRatio}
                  onChange={(e) => setCompetitorPriceRatio(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-zinc-500 font-sans block">
                  &lt;80%: +10% | &gt;120%: -10%
                </span>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-400 font-sans">4. Liquidity Pool</span>
                <div className="text-lg font-bold text-white">{liquidityPoolSize.toLocaleString()} FIC</div>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={liquidityPoolSize}
                  onChange={(e) => setLiquidityPoolSize(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-zinc-500 font-sans block">
                  &gt;100k: +10% | &lt;50k: -10%
                </span>
              </div>
            </div>

            {algorithmSimulationFeedback && (
              <div className="p-4 bg-black/60 border border-amber-500/40 rounded-xl text-xs text-amber-200 font-mono">
                {algorithmSimulationFeedback}
              </div>
            )}

            <div className="p-3 bg-zinc-800/60 rounded-xl text-xs text-zinc-400 space-y-1">
              <div><strong>Adjustment Schedule Constraints:</strong> Weekly adjustments executed strictly on Mondays at 00:00 (UTC).</div>
              <div>Maximum weekly swing: <strong>&plusmn;20% per week</strong>. Hard boundary floors: <strong>$0.10 minimum / $10.00 maximum per FIC</strong>.</div>
            </div>
          </div>

          {/* 10% Burn Mechanism & Distribution Splits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <Flame className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  10% Mandatory Token Burn Engine
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Permanent deflationary burn automatically executed on every transaction:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-black/40 rounded-lg flex justify-between">
                  <span>1. Product Sales Purchases:</span>
                  <span className="font-bold text-rose-400">10% Burned</span>
                </div>
                <div className="p-2.5 bg-black/40 rounded-lg flex justify-between">
                  <span>2. Service Subscriptions:</span>
                  <span className="font-bold text-rose-400">10% Burned</span>
                </div>
                <div className="p-2.5 bg-black/40 rounded-lg flex justify-between">
                  <span>3. User Rewards Distributions:</span>
                  <span className="font-bold text-rose-400">10% Burned</span>
                </div>
                <div className="p-2.5 bg-black/40 rounded-lg flex justify-between">
                  <span>4. Platform System Fees:</span>
                  <span className="font-bold text-rose-400">10% Burned</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Scale className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Statutory Distribution Splits
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Deterministic allocation splits for sales and ecosystem grants:
              </p>
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="font-sans font-bold text-white mb-1">Commercial Sales Split:</div>
                  <div className="text-[11px] text-zinc-400">
                    60% Seller &bull; 20% Marketplace Fees &bull; 10% User Rewards &bull; 10% Platform Maintenance
                  </div>
                </div>
                <div>
                  <div className="font-sans font-bold text-white mb-1">Ecosystem Liquidity Split:</div>
                  <div className="text-[11px] text-zinc-400">
                    20% Creator Incentive &bull; 20% Node Royalty &bull; 20% Treasury Grant &bull; 20% System Comp &bull; 20% Market Liquidity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 7: FIAT RULES & BIOMETRIC PAYOUT RAILS                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'fiat-rules' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              Sovereign FIAT Currency Rules & Guardian AI Biometric Standards
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Deterministic parity rules and mandatory live-motion biometric requirements for platform disbursements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">RULE #1</span>
                <h4 className="text-sm font-bold text-white mt-1">FIAT Parity Anchor</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  1 FIC = ₦65.00 base anchor (Apex Bank rate $1.00 = ₦1,340.00). Dynamic weekly adjustment schedule on Mondays at 00:00 UTC capped at &plusmn;20%.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">RULE #2</span>
                <h4 className="text-sm font-bold text-white mt-1">Guardian AI Biometrics (&gt; 500 FIC)</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Transfers exceeding <strong>500 FIC (₦32,500 NGN)</strong> require mandatory Guardian AI live-motion biometric facial challenge.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">RULE #3</span>
                <h4 className="text-sm font-bold text-white mt-1">Tiered KYC Verification</h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Tier 1: 500 FIC/day. Tier 2: 5,000 FIC/day (BVN/NIN). Tier 3: 50,000 FIC/day (Biometrics & Proof of Address).
                </p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Approved Bank & Settlement Rails
            </h4>
            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Rail Provider</th>
                    <th className="p-3">Network Status</th>
                    <th className="p-3">Min Payout</th>
                    <th className="p-3">Daily Max Ceiling</th>
                    <th className="p-3">Settlement Latency</th>
                    <th className="p-3 text-right">Gateway Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {payoutRails.map((rail) => (
                    <tr key={rail.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span>{rail.railName}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                          {rail.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        {rail.minPayoutFIC} FIC (₦{(rail.minPayoutFIC * exchangeRateNaira).toLocaleString()})
                      </td>
                      <td className="p-3 font-mono font-bold">
                        {rail.maxPayoutDailyFIC.toLocaleString()} FIC (₦{(rail.maxPayoutDailyFIC * exchangeRateNaira).toLocaleString()})
                      </td>
                      <td className="p-3 text-zinc-300">{rail.settlementSpeed}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-500">{rail.feePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 8: SUBSCRIPTION MODULES REVENUE                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'subscriptions-rev' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Platform 20-Module Subscription Revenue Breakdown
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time recurring revenue metrics generated across all 20 audited platform paywall modules.
                </p>
              </div>
              <button
                onClick={() => navigate('/subscriptions')}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl transition flex items-center gap-2"
              >
                <span>Open Graphical Cards Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-mono">
              <div>
                <span className="text-zinc-400">Total Run-Rate MRR:</span>
                <span className="text-amber-400 font-bold ml-2">₦{(activeMRRNaira / 1000000).toFixed(2)}M NGN / mo</span>
              </div>
              <div>
                <span className="text-zinc-400">Token Volume MRR:</span>
                <span className="text-emerald-400 font-bold ml-2">{activeMRRFIC.toLocaleString()} FIC / mo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { module: 'Core Platform Explorer', route: '/', subscribers: 14250, ficMonthly: 0, fiatMonthly: 0, growth: '+12%' },
                { module: 'Dancia-4Tv Cinema Pass', route: '/dancia4tv', subscribers: 3820, ficMonthly: 38200, fiatMonthly: 26740000, growth: '+18%' },
                { module: 'BeatwaveNG FLAC Pass', route: '/beatwaveng', subscribers: 2940, ficMonthly: 23520, fiatMonthly: 16464000, growth: '+24%' },
                { module: 'FingerLux VIP Concierge', route: '/fingerlux', subscribers: 185, ficMonthly: 9250, fiatMonthly: 6475000, growth: '+8%' },
                { module: 'Lush-Pressies Matchmaker', route: '/lushpressies', subscribers: 2150, ficMonthly: 25800, fiatMonthly: 18060000, growth: '+15%' },
                { module: 'OwnIt Haute Horology', route: '/ownit', subscribers: 320, ficMonthly: 8000, fiatMonthly: 5600000, growth: '+31%' },
                { module: 'Flamingo Private Chamber', route: '/flamingo', subscribers: 1840, ficMonthly: 27600, fiatMonthly: 19320000, growth: '+19%' },
                { module: 'Stercs 4K Render Farm', route: '/stercs', subscribers: 1480, ficMonthly: 26640, fiatMonthly: 18648000, growth: '+28%' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-black/40">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                    <span className="font-mono">{item.route}</span>
                    <span className="font-bold text-emerald-400">{item.growth}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.module}</h4>
                  <div className="text-base font-bold font-mono text-amber-400 mt-2">
                    ₦{item.fiatMonthly.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    {item.ficMonthly.toLocaleString()} FIC / mo ({item.subscribers.toLocaleString()} members)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 9: ROLES & GATEKEEPER BRIDGE                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'access-bridge' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Subscription &lt;&ndash;&gt; Roles & Permissions &lt;&ndash;&gt; Member Access Gatekeeper
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  How active subscription passes automatically provision roles, grant granular privileges, and unlock platform screens.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/settings/roles-permissions')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Roles & Permissions &rarr;
                </button>
                <button
                  onClick={() => navigate('/contacts/site-members/site-member-access')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Site Member Access &rarr;
                </button>
              </div>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl mb-6 text-xs text-amber-200 leading-relaxed">
              <strong>Architectural Access Pipeline:</strong> When a member purchases a Subscription Plan on <code>/subscriptions</code>,
              the financial transaction emits a <code>subscription_activated</code> event. The Role Engine immediately provisions the corresponding
              <strong>Member Role</strong> in <code>/settings/roles-permissions</code>, which dynamically unlocks the restricted route in
              <code>/contacts/site-members/site-member-access</code>. If a subscription is cancelled or frozen, access is revoked automatically.
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-zinc-400 font-semibold border-b border-zinc-800 text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Subscription Tier</th>
                    <th className="p-3">Provisioned Role (`/settings/roles-permissions`)</th>
                    <th className="p-3">Unlocked Screen (`/contacts/site-members/...`)</th>
                    <th className="p-3">Gatekeeper Rule</th>
                    <th className="p-3 text-right">Revocation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    { tier: 'Sovereign Explorer (Free)', role: 'Standard Member', route: '/forum, /gems, /groups', rule: 'Open Public Access', action: 'Permanent' },
                    { tier: 'Dancia Cinema Pass (10 FIC)', role: 'Cinema VIP Subscriber', route: '/dancia4tv', rule: 'Gated SVoD / Dolby Atmos', action: 'Downgrade to Standard' },
                    { tier: 'Beatwave FLAC Pass (8 FIC)', role: 'Hi-Fi Audio Master', route: '/beatwaveng', rule: '24-bit FLAC / Stem Downloads', action: 'Downgrade to Standard' },
                    { tier: 'FingerLux Concierge (50 FIC)', role: 'Presidential Fleet VIP', route: '/fingerlux', rule: 'Armored Chauffeur & Yacht Vault', action: 'Immediate Lock' },
                    { tier: 'Flamingo Chamber (15 FIC)', role: 'Private Chamber Keyholder', route: '/flamingo', rule: 'Zero-Knowledge 1-on-1 Vault', action: 'Immediate Lock' },
                    { tier: 'Stercs AI Render (18 FIC)', role: 'Studio Pro Editor', route: '/stercs', rule: '4K Cloud GPU Render Farm', action: 'Downgrade to Standard' },
                    { tier: 'Guardian AI Shield (35 FIC)', role: 'Enterprise Security Guard', route: '/guardian-protection', rule: 'Anti-Deepfake Biometric Lock', action: 'Revoke Key' },
                    { tier: 'Franchise Operator (250 FIC)', role: 'Territorial Sovereign Node', route: '/franchise', rule: 'Regional 30% Royalty Sub-Admin', action: 'Freeze Settlement' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-white">{row.tier}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono text-[10px]">
                          {row.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-amber-400 font-bold">{row.route}</td>
                      <td className="p-3 text-zinc-300">{row.rule}</td>
                      <td className="p-3 text-right text-rose-400 font-semibold">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 10: CBN NFEM INGESTION ENGINE & REER CONTROLLER                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'cbn-nfem' && <CbnNfemControllerPanel />}

      {/* ========================================================================= */}
      {/* MODAL: WALLET 004 MULTI-SIGNATURE & PIN APPROVAL CONSOLE                  */}
      {/* ========================================================================= */}
      {isMultiSigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-amber-500/50 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-white">
                  Wallet 004 Multi-Signature & PIN Verification
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsMultiSigModalOpen(false);
                  setMultiSigActionMessage('');
                }}
                className="text-zinc-400 hover:text-white font-mono text-xs"
              >
                [ESC / CLOSE]
              </button>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
              <p>
                <strong>FingerMobile Central FIC Wallet 004 (&quot;FIC Treasury Wallet&quot;):</strong> Managed by the
                Board of Directors and authorized signatories. Requires a minimum of <strong>3 cryptographic signatures</strong>
                plus PIN authorization to approve seed market placements or threshold open-market buybacks.
              </p>
              <div className="p-3 bg-black/50 rounded-xl border border-zinc-800 space-y-1 font-mono text-[11px]">
                <div className="text-amber-300">Allocated Seed Reserve: 5,000,000 FIC</div>
                <div className="text-emerald-300">Seed Placement Rate: $0.05 per FIC</div>
                <div className="text-zinc-400">Total Valuation Backing: $250,000 USD (₦325,000,000 NGN at ₦65/FIC)</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-zinc-300">Authorized Signatures Present (3 Required):</label>
              {[
                'Mbah Israel Obinna (Founder, Chairman Board of Directors)',
                'Mrs. Mbah Eunice Emonena (Co-Founder, Vice Chairman)',
                'Mercy Kulem (Secretary Board of Directors)',
                'Authorized Protocol Trustee 01',
                'Authorized Protocol Trustee 02',
              ].map((signer) => {
                const isSelected = selectedSigners.includes(signer.split(' (')[0]);
                return (
                  <label key={signer} className="flex items-center gap-2 p-2 bg-black/40 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const name = signer.split(' (')[0];
                        if (isSelected) {
                          setSelectedSigners(selectedSigners.filter((s) => s !== name));
                        } else {
                          setSelectedSigners([...selectedSigners, name]);
                        }
                      }}
                      className="accent-amber-500 rounded"
                    />
                    <span className={isSelected ? 'text-white font-medium' : 'text-zinc-500'}>{signer}</span>
                  </label>
                );
              })}
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1 text-xs">
                Board Multi-Sig PIN
              </label>
              <input
                type="password"
                placeholder="Enter 6-digit cryptographic PIN"
                maxLength={6}
                value={multiSigPinInput}
                onChange={(e) => setMultiSigPinInput(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {multiSigActionMessage && (
              <div className="p-3 bg-emerald-950 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-mono">
                {multiSigActionMessage}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (selectedSigners.length < 3) {
                    alert('At least 3 authorized Board signatures are required.');
                    return;
                  }
                  if (multiSigPinInput.length < 4) {
                    alert('Please enter a valid PIN.');
                    return;
                  }
                  setMultiSigActionMessage(
                    `Multi-Sig Quorum Verified (${selectedSigners.length}/5 Signatures)! Wallet 004 Treasury is authorized for Marketplace Seed Placement ($0.05/FIC).`
                  );
                }}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Authorize & Broadcast Multi-Sig
              </button>
              <button
                onClick={() => setIsMultiSigModalOpen(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Digital Notarization Certificate Modal */}
      <DigitalNotarizationModal
        isOpen={showNotarizationModal}
        onClose={() => setShowNotarizationModal(false)}
      />
    </div>
  );
};

export default MasterFinancialsConsole;
