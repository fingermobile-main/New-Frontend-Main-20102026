import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  ChartBarIcon,
  GiftIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  PlusIcon
} from '../icons';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Users,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  Lock,
  RefreshCw,
  CreditCard,
  ArrowUpRight,
  Coins,
  Award
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import {
  DEDICATED_TREASURY_RAIL,
  PLATFORM_OWNERSHIP,
  FINANCIAL_ROLES_TAXONOMY,
  AccountingRole
} from '../constants/platformOwnership';
import { downloadFicReceiptPdf, FICReceiptData } from '../utils/ficReceiptPdf';

interface WalletTransaction {
  id: string | number;
  type: string;
  amount: number;
  from?: string;
  to?: string;
  date: string;
  description?: string;
  status?: string;
}

export interface TreasuryFundingRequestItem {
  id: number;
  requestReference: string;
  userId: string;
  userName: string;
  userEmail: string;
  userWalletAddress: string;
  amountFIC: number;
  amountNGN: number;
  ratePerFIC: number;
  rateType: 'standard' | 'treasury_seed';
  destinationBankName: string;
  destinationAccountNumber: string;
  destinationAccountName: string;
  depositorName: string;
  depositorBank: string;
  bankTxReference: string;
  paymentMethod: string;
  proofNotes?: string;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED_BY_TREASURY' | 'APPROVED_AND_FUNDED' | 'REJECTED';
  treasuryStaffId?: string;
  treasuryStaffName?: string;
  treasuryStaffRole?: string;
  treasuryConfirmedAt?: string;
  autoApproved?: boolean;
  cfoId?: string;
  cfoName?: string;
  cfoApprovedAt?: string;
  cfoNotes?: string;
  deductedFromVault?: string;
  vaultDepletionSequence?: Array<{
    vaultNumber: string;
    vaultName: string;
    amountDeductedFIC: number;
    remainingVaultBalanceFIC: number;
  }>;
  pdfReceiptNumber?: string;
  pdfReceiptSerial?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SovereignVaultItem {
  id: string;
  vaultNumber: string;
  vaultName: string;
  custodianTitle: string;
  authorizedSigners: string[];
  walletAddress: string;
  balanceFIC: number;
  initialAllocationFIC: number;
  depletedFIC: number;
  unitPriceUSD: number;
  priorityOrder: number;
  isActive: boolean;
}

const NIGERIAN_BANKS = [
  'Alternative Bank',
  'Access Bank',
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'United Bank for Africa (UBA)',
  'First Bank of Nigeria',
  'Fidelity Bank',
  'Stanbic IBTC Bank',
  'Providus Bank',
  'Kuda Bank',
  'Opay',
  'Moniepoint',
  'Other / Wire Transfer'
];

const WalletPage: React.FC = () => {
  const { toast } = useToast();

  // Wallet balances
  const [balance, setBalance] = useState(0);
  const [fiatBalance, setFiatBalance] = useState(0);
  const [ficBalance, setFicBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Treasury funding state
  const [treasuryRequests, setTreasuryRequests] = useState<TreasuryFundingRequestItem[]>([]);
  const [sovereignVaults, setSovereignVaults] = useState<SovereignVaultItem[]>([]);
  const [loadingTreasury, setLoadingTreasury] = useState(false);

  // Modal States
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);

  // Fund Wallet Form Fields
  const [fundRateType, setFundRateType] = useState<'treasury_seed' | 'standard'>('treasury_seed');
  const [fundAmountFic, setFundAmountFic] = useState('500');
  const [fundAmountNgn, setFundAmountNgn] = useState('32500');
  const [depositorName, setDepositorName] = useState('John Doe');
  const [depositorBank, setDepositorBank] = useState('Alternative Bank');
  const [bankTxRef, setBankTxRef] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('member@fingermobileprotocol.com');
  const [proofNotes, setProofNotes] = useState('Alternative Bank Sovereign Rail Direct Transfer');

  // Generic Action Modal Fields
  const [actionAmount, setActionAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Staff and CFO action states
  const [selectedStaffCode, setSelectedStaffCode] = useState('staff_accountant_3');
  const [autoApproveFlag, setAutoApproveFlag] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const effectiveRate = useMemo(() => {
    return fundRateType === 'treasury_seed'
      ? DEDICATED_TREASURY_RAIL.seedRatePerFic
      : DEDICATED_TREASURY_RAIL.standardRatePerFic;
  }, [fundRateType]);

  // Keep FIC and NGN in sync
  const handleFicAmountChange = (ficVal: string) => {
    setFundAmountFic(ficVal);
    const num = parseFloat(ficVal);
    if (!isNaN(num) && num > 0) {
      setFundAmountNgn((num * effectiveRate).toFixed(2));
    } else {
      setFundAmountNgn('');
    }
  };

  const handleNgnAmountChange = (ngnVal: string) => {
    setFundAmountNgn(ngnVal);
    const num = parseFloat(ngnVal);
    if (!isNaN(num) && num > 0 && effectiveRate > 0) {
      setFundAmountFic((num / effectiveRate).toFixed(2));
    } else {
      setFundAmountFic('');
    }
  };

  const handleRateTypeChange = (type: 'treasury_seed' | 'standard') => {
    setFundRateType(type);
    const rate = type === 'treasury_seed'
      ? DEDICATED_TREASURY_RAIL.seedRatePerFic
      : DEDICATED_TREASURY_RAIL.standardRatePerFic;
    const ficNum = parseFloat(fundAmountFic);
    if (!isNaN(ficNum) && ficNum > 0) {
      setFundAmountNgn((ficNum * rate).toFixed(2));
    }
  };

  // Fetch live wallet data
  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const balanceData = await apiService.get('/api/wallet/balance');
      if (balanceData) {
        const bal = balanceData.balance || balanceData.ficBalance || 0;
        setBalance(bal);
        setFicBalance(bal);
        setFiatBalance(balanceData.fiatBalance || parseFloat((bal * 0.1).toFixed(2)));
        if (balanceData.data?.wallet_address) {
          setWalletAddress(balanceData.data.wallet_address);
        }
      }

      if (!walletAddress) {
        const walletInfo = await apiService.get('/api/wallet');
        if (walletInfo?.data?.wallet_address) {
          setWalletAddress(walletInfo.data.wallet_address);
        }
      }

      const txData = await apiService.get('/api/wallet/transactions');
      if (txData && (txData.transactions || txData.data)) {
        setTransactions(txData.transactions || txData.data);
      }
    } catch (err) {
      console.error('Failed to fetch live wallet data', err);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  // Fetch live Treasury requests and Vaults
  const fetchTreasuryData = useCallback(async () => {
    try {
      setLoadingTreasury(true);
      const [reqRes, vaultsRes] = await Promise.all([
        apiService.get('/api/treasury/requests'),
        apiService.get('/api/treasury/vaults')
      ]);

      if (reqRes?.success && Array.isArray(reqRes.data)) {
        setTreasuryRequests(reqRes.data);
      }
      if (vaultsRes?.success && Array.isArray(vaultsRes.vaults)) {
        setSovereignVaults(vaultsRes.vaults);
      }
    } catch (err) {
      console.error('Failed to fetch live treasury data', err);
    } finally {
      setLoadingTreasury(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
    fetchTreasuryData();
  }, [fetchWalletData, fetchTreasuryData]);

  // Copy Account Number
  const copyAccountNumber = () => {
    navigator.clipboard.writeText(DEDICATED_TREASURY_RAIL.accountNumber);
    setCopiedAccount(true);
    toast({
      title: 'Account Number Copied',
      description: `${DEDICATED_TREASURY_RAIL.accountNumber} (Alternative Bank)`
    });
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  // Submit Treasury Funding Request (Alternative Bank Rail)
  const handleSubmitTreasuryFunding = async (e: React.FormEvent) => {
    e.preventDefault();
    const fic = parseFloat(fundAmountFic);
    const ngn = parseFloat(fundAmountNgn);

    if (isNaN(fic) || fic <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please specify a valid deposit amount in FIC or NGN.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        amountFIC: fic,
        amountNGN: ngn,
        ratePerFIC: effectiveRate,
        rateType: fundRateType,
        destinationBankName: DEDICATED_TREASURY_RAIL.bankName,
        destinationAccountNumber: DEDICATED_TREASURY_RAIL.accountNumber,
        destinationAccountName: DEDICATED_TREASURY_RAIL.accountName,
        depositorName: depositorName.trim() || 'Valued Member',
        depositorBank: depositorBank.trim() || 'Alternative Bank',
        bankTxReference: bankTxRef.trim() || `ALT/${Date.now()}/${Math.floor(1000 + Math.random() * 9000)}`,
        userEmail: receiptEmail.trim() || 'member@fingermobileprotocol.com',
        userWalletAddress: walletAddress || '0xDEF...987',
        paymentMethod: 'Alternative Bank Dedicated Sovereign Treasury Rail',
        proofNotes: proofNotes.trim()
      };

      const res = await apiService.post('/api/treasury/fund-request', payload);
      if (res?.success) {
        toast({
          title: 'Funding Request Submitted Successfully',
          description: `Reference: ${res.data.requestReference}. Awaiting Treasury Staff (Account Staff 1-7) confirmation.`
        });
        setShowFundModal(false);
        setBankTxRef('');
        fetchTreasuryData();
      } else {
        toast({
          title: 'Submission Failed',
          description: res?.error || 'Unable to register funding request.',
          variant: 'destructive'
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error Submitting Request',
        description: err.message || 'Server communication error.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Treasury Staff Confirmation
  const handleConfirmByTreasuryStaff = async (requestId: number) => {
    try {
      setIsSubmitting(true);
      const staffMember = FINANCIAL_ROLES_TAXONOMY.find((r) => r.roleCode === selectedStaffCode);
      const res = await apiService.post(`/api/treasury/requests/${requestId}/confirm`, {
        staffId: selectedStaffCode,
        staffName: staffMember?.roleName || 'Account Staff 3',
        staffRole: staffMember?.roleName || 'Staff Accountant',
        autoApproved: autoApproveFlag
      });

      if (res?.success) {
        toast({
          title: 'Payment Confirmed by Treasury Staff',
          description: `Confirmed by ${res.data.treasuryStaffName}. Awaiting CFO Mrs. Mbah Eunice Emonena final approval.`
        });
        fetchTreasuryData();
        fetchWalletData();
      }
    } catch (err: any) {
      toast({
        title: 'Confirmation Failed',
        description: err.message || 'Unable to confirm payment.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // CFO Final Approval & Waterfall Disburse
  const handleCfoFinalApproval = async (requestId: number) => {
    try {
      setIsSubmitting(true);
      const res = await apiService.post(`/api/treasury/requests/${requestId}/cfo-approve`, {
        cfoNotes: 'Verified against Alternative Bank 0514108422 Rail. Release authorized from Wallet 004.'
      });

      if (res?.success) {
        toast({
          title: 'CFO Final Approval Executed & Wallet Funded!',
          description: `Mrs. Mbah Eunice Emonena approved release. ${res.data.amountFIC} FIC credited to member wallet from ${res.data.deductedFromVault || 'Wallet 004'}.`
        });
        fetchTreasuryData();
        fetchWalletData();
      }
    } catch (err: any) {
      toast({
        title: 'CFO Approval Failed',
        description: err.message || 'Unable to finalize approval.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download PDF Receipt for an approved request
  const handleDownloadReceipt = (req: TreasuryFundingRequestItem) => {
    const receiptData: FICReceiptData = {
      receiptNumber: req.pdfReceiptNumber || `RCPT-${req.id}`,
      purchaserName: req.userName || req.depositorName || 'Valued Member',
      purchaserEmail: req.userEmail || 'member@fingermobileprotocol.com',
      walletAddress: req.userWalletAddress || walletAddress || '0xDEF...987',
      amountFIC: req.amountFIC,
      ratePerFIC: req.ratePerFIC,
      totalNaira: req.amountNGN,
      totalUSD: parseFloat((req.amountFIC * 0.05).toFixed(2)),
      bankName: req.destinationBankName || DEDICATED_TREASURY_RAIL.bankName,
      accountNumber: req.destinationAccountNumber || DEDICATED_TREASURY_RAIL.accountNumber,
      accountName: req.destinationAccountName || DEDICATED_TREASURY_RAIL.accountName,
      txHash: req.bankTxReference || `ALT-${req.requestReference}`,
      timestamp: req.cfoApprovedAt || req.updatedAt || new Date().toISOString(),
      serialNumber: req.pdfReceiptSerial || `FIC-ALTBNK-${req.id}-004`,
      status: req.status === 'APPROVED_AND_FUNDED' ? 'APPROVED & FUNDED' : 'PENDING VERIFICATION',
      treasuryStaffName: req.treasuryStaffName || 'Account Staff 3',
      treasuryStaffRole: req.treasuryStaffRole || 'Staff Accountant',
      cfoApprovedBy: req.cfoName || PLATFORM_OWNERSHIP.coFounder.name,
      cfoApprovedAt: req.cfoApprovedAt || req.updatedAt,
      sourceVault: req.deductedFromVault || 'Wallet 004 Treasury & Seed Sale'
    };

    downloadFicReceiptPdf(receiptData);
    toast({
      title: 'Official PDF Receipt Downloaded',
      description: `Downloaded receipt ${receiptData.receiptNumber} with official CFO Root attestation.`
    });
  };

  // Legacy Withdraw
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid withdrawal amount', variant: 'destructive' });
      return;
    }
    if (amountNum > ficBalance) {
      toast({ title: 'Insufficient Funds', description: 'Withdrawal amount exceeds your FIC balance.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.post('/api/wallet/withdraw', {
        amount: amountNum,
        withdrawal_method: 'bank_transfer',
        account_details: { bankName: selectedMethod }
      });
      toast({ title: 'Withdrawal Initiated', description: `Withdrawal of ${amountNum} FIC is being processed.` });
      setShowWithdrawModal(false);
      setActionAmount('');
      fetchWalletData();
    } catch (error) {
      toast({ title: 'Withdrawal Failed', description: 'Could not process withdrawal.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Legacy Send Money
  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid transfer amount', variant: 'destructive' });
      return;
    }
    if (!recipientAddress.trim()) {
      toast({ title: 'Recipient Required', description: 'Please specify the recipient address or member ID', variant: 'destructive' });
      return;
    }
    if (amountNum > ficBalance) {
      toast({ title: 'Insufficient Funds', description: 'Transfer amount exceeds your FIC balance.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.post('/api/wallet/transfer', {
        recipient_wallet_address: recipientAddress.trim(),
        amount: amountNum,
        note: 'Direct wallet transfer'
      });
      toast({ title: 'Transfer Completed', description: `Sent ${amountNum} FIC to ${recipientAddress}.` });
      setShowSendModal(false);
      setActionAmount('');
      setRecipientAddress('');
      fetchWalletData();
    } catch (error) {
      toast({ title: 'Transfer Failed', description: 'Failed to execute transfer.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Wallet">
      <div className="bg-slate-50 min-h-screen text-gray-900 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Top Header & Sovereign Protocol Notice */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Alternative Bank Treasury Rail Connected
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  CBN Licensed & Supervised
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Live Sovereign Wallet & Vault</h1>
              <p className="text-sm text-slate-600 mt-1">
                Official protocol rail for member funding, automated treasury confirmations, and CFO release.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRolesModal(true)}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold gap-1.5"
              >
                <Users className="w-4 h-4 text-slate-500" />
                Accounting Roles Directory
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  fetchWalletData();
                  fetchTreasuryData();
                  toast({ title: 'Refreshed', description: 'Synchronized live wallet & treasury state.' });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingTreasury ? 'animate-spin' : ''}`} />
                Sync Protocol
              </Button>
            </div>
          </div>

          {/* DEDICATED SOVEREIGN TREASURY RAIL - HERO BANNER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-400/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                      Dedicated Sovereign Protocol Treasury Rail
                    </span>
                    <h2 className="text-2xl font-black text-white">Alternative Bank Protocol Funding</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    CBN Licensed & Supervised Institution
                  </span>
                </div>
              </div>

              {/* Bank Account Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <span className="text-slate-400 font-sans block text-[11px]">Designated Apex Bank</span>
                  <p className="text-lg font-bold text-white mt-1">Alternative Bank</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">CBN Licensed & Supervised Institution</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 backdrop-blur-xs relative group">
                  <span className="text-amber-300 font-sans block text-[11px] font-semibold">Treasury Account Number</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-2xl font-black text-amber-300 tracking-wider">0514108422</p>
                    <button
                      onClick={copyAccountNumber}
                      className="p-1.5 bg-amber-400/20 hover:bg-amber-400/30 rounded-lg text-amber-300 transition-colors"
                      title="Copy Treasury Account Number"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-200/80 font-sans mt-0.5">Dedicated Sovereign Protocol Treasury Rail</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <span className="text-slate-400 font-sans block text-[11px]">Account Name</span>
                  <p className="text-sm font-bold text-white mt-1 break-words">FingerMobile Protocol Communication</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Official Corporate Settlement Account</p>
                </div>
              </div>

              {/* End-to-End Procedure Flow Visualizer */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    End-to-End Treasury Funding & Disbursement Architecture
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">Strict Zero Error Policy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-amber-400 font-bold font-mono">STEP 1</span>
                    <p className="text-slate-200 font-semibold mt-0.5">Pay to Alternative Bank</p>
                    <p className="text-[10px] text-slate-400">Transfer into dedicated rail 0514108422</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-amber-400 font-bold font-mono">STEP 2</span>
                    <p className="text-slate-200 font-semibold mt-0.5">Submit Proof</p>
                    <p className="text-[10px] text-slate-400">Enter bank transaction ref / teller number</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-amber-400 font-bold font-mono">STEP 3</span>
                    <p className="text-slate-200 font-semibold mt-0.5">Treasury Staff Confirms</p>
                    <p className="text-[10px] text-slate-400">Account Staff 1 to 7 confirms at Accounts</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-amber-400 font-bold font-mono">STEP 4</span>
                    <p className="text-slate-200 font-semibold mt-0.5">CFO Final Approval</p>
                    <p className="text-[10px] text-slate-400">Mrs. Mbah Eunice Emonena authorizes release</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                    <span className="text-emerald-400 font-bold font-mono">STEP 5</span>
                    <p className="text-emerald-200 font-semibold mt-0.5">Deduct 004 & Fund</p>
                    <p className="text-[10px] text-emerald-300">Wallet 004 depleted, PDF receipt sent</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowFundModal(true)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm px-6 py-2.5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Fund Wallet via Alternative Bank Rail
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowReceiveModal(true)}
                    className="border-white/20 hover:bg-white/10 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5"
                  >
                    <QrCodeIcon className="w-4 h-4 text-indigo-300" />
                    My Wallet Address & QR
                  </Button>
                </div>

                <div className="text-right text-xs text-slate-300 font-mono">
                  <span>Seed Anchor: </span>
                  <span className="text-amber-300 font-bold">₦65.00 / FIC ($0.05)</span>
                  <span className="mx-2 text-slate-500">|</span>
                  <span>Standard: </span>
                  <span className="text-emerald-300 font-bold">₦650.00 / FIC ($0.50)</span>
                </div>
              </div>
            </div>
          </div>

          {/* BALANCE OVERVIEW & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border border-slate-200/80 shadow-xs rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Confirmed Live Balance
                    </CardDescription>
                    <CardTitle className="text-4xl font-black text-slate-900 mt-1">
                      {ficBalance.toLocaleString()} <span className="text-indigo-600 text-2xl font-bold">FIC</span>
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-500 block">FIAT Valuation</span>
                    <span className="text-xl font-bold text-slate-900">₦{(ficBalance * 650).toLocaleString()} NGN</span>
                    <span className="text-xs text-slate-400 block font-mono">~${(ficBalance * 0.5).toFixed(2)} USD</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    onClick={() => setShowFundModal(true)}
                    className="flex flex-col items-center justify-center h-20 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-2xl gap-1"
                  >
                    <PlusIcon className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold">Deposit Funds</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowSendModal(true)}
                    className="flex flex-col items-center justify-center h-20 hover:bg-slate-100 border border-slate-200 rounded-2xl gap-1 text-slate-800"
                  >
                    <ArrowUpIcon className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold">Send FIC</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex flex-col items-center justify-center h-20 hover:bg-slate-100 border border-slate-200 rounded-2xl gap-1 text-slate-800"
                  >
                    <ArrowDownIcon className="w-5 h-5 text-rose-600" />
                    <span className="text-xs font-bold">Withdraw</span>
                  </Button>

                  <Link
                    to="/dashboard/financials?subtab=treasury"
                    className="flex flex-col items-center justify-center h-20 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl gap-1 text-slate-800"
                  >
                    <Lock className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-bold">Master Treasury</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Wallet Address Card */}
            <Card className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <WalletIcon className="w-4 h-4 text-indigo-600" />
                    Member Protocol ID
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-700 break-all select-all">
                  {walletAddress || '0xDEF482...987A21'}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Permanent cryptographic account linked to your verified NIN identity.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs font-bold"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress || '0xDEF482...987A21');
                    toast({ title: 'Copied', description: 'Wallet address copied to clipboard.' });
                  }}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Address
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs font-bold"
                  onClick={() => setShowReceiveModal(true)}
                >
                  <QrCodeIcon className="w-3.5 h-3.5 mr-1" />
                  Show QR
                </Button>
              </div>
            </Card>
          </div>

          {/* MAIN TABS: TREASURY REQUESTS & HISTORY */}
          <Tabs defaultValue="treasury_funding" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-200/70 p-1 rounded-2xl">
              <TabsTrigger value="treasury_funding" className="rounded-xl font-bold text-xs">
                Treasury Funding Tracker ({treasuryRequests.length})
              </TabsTrigger>
              <TabsTrigger value="vault_depletion" className="rounded-xl font-bold text-xs">
                Sovereign Vault Waterfall Status
              </TabsTrigger>
              <TabsTrigger value="tx_history" className="rounded-xl font-bold text-xs">
                General Ledger Transactions ({transactions.length})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: TREASURY FUNDING REQUESTS TRACKER */}
            <TabsContent value="treasury_funding" className="space-y-6">
              <Card className="bg-white border border-slate-200/80 shadow-xs rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Alternative Bank Treasury Funding Requests
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Live status from payment confirmation by Treasury Staff to final release by CFO Mrs. Mbah Eunice Emonena.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowFundModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    New Funding Request
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  {treasuryRequests.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-700">No Treasury Funding Requests Found</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Make a transfer to Alternative Bank (0514108422) and submit your transaction reference to fund your wallet.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowFundModal(true)}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                      >
                        Submit Deposit Proof
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono font-bold text-[10px]">
                          <tr>
                            <th className="py-3.5 px-4">Request Ref</th>
                            <th className="py-3.5 px-4">Amount / Consideration</th>
                            <th className="py-3.5 px-4">Depositor & Bank Ref</th>
                            <th className="py-3.5 px-4">Treasury & CFO State</th>
                            <th className="py-3.5 px-4">Vault Source</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {treasuryRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-4 font-mono">
                                <span className="font-bold text-indigo-700 block">{req.requestReference}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <span className="font-bold text-slate-900 block text-sm">
                                  {req.amountFIC.toLocaleString()} FIC
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  ₦{req.amountNGN.toLocaleString()} (Rate: ₦{req.ratePerFIC}/FIC)
                                </span>
                              </td>

                              <td className="py-4 px-4 font-mono text-slate-700">
                                <span className="font-semibold block text-slate-900">{req.depositorName}</span>
                                <span className="text-[11px] text-slate-500 block">{req.depositorBank}</span>
                                <span className="text-[10px] text-slate-400">{req.bankTxReference}</span>
                              </td>

                              <td className="py-4 px-4">
                                {req.status === 'PENDING_CONFIRMATION' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                      <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                                      Pending Treasury Staff (Staff 1-7)
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">Awaiting confirmation at Accounts</p>
                                  </div>
                                )}

                                {req.status === 'CONFIRMED_BY_TREASURY' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                      Confirmed by {req.treasuryStaffName || 'Staff Accountant'}
                                    </span>
                                    <p className="text-[10px] text-amber-600 font-bold mt-1">
                                      Awaiting CFO Mrs. Mbah Eunice Emonena final sign-off
                                    </p>
                                  </div>
                                )}

                                {req.status === 'APPROVED_AND_FUNDED' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      CFO Approved & Wallet Funded
                                    </span>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                      Authorized by {req.cfoName || 'Mrs. Mbah Eunice Emonena (CFO)'}
                                    </p>
                                  </div>
                                )}
                              </td>

                              <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                                {req.deductedFromVault ? (
                                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                                    {req.deductedFromVault.includes('004') ? 'Wallet 004 Treasury & Seed' : req.deductedFromVault}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Waterfall 004 Queue</span>
                                )}
                              </td>

                              <td className="py-4 px-4 text-right space-y-1.5">
                                {req.status === 'APPROVED_AND_FUNDED' ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleDownloadReceipt(req)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    PDF Receipt
                                  </Button>
                                ) : (
                                  <span className="text-[11px] text-slate-400 font-mono block">In Processing Pipeline</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* INTERACTIVE TREASURY STAFF & CFO TEST BRIDGE (DEVELOPMENT & MASTERDASHBOARD ACCOUNTS SHORTCUT) */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      MasterDashboard Accounts Treasury & CFO Bridge
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simulate or execute live Treasury Staff confirmation and CFO final authorization right from the interface.
                    </p>
                  </div>
                  <Link
                    to="/dashboard/financials?subtab=member-purchase"
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Go to MasterDashboard Accounts
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Treasury Staff Confirmation Panel */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        1. Treasury Staff Confirmation
                      </span>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                        Staff 1 to 7
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Select the acting Treasury Staff member to verify deposit at Alternative Bank (0514108422):
                    </p>

                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold text-slate-700 block">Acting Account Staff</label>
                      <select
                        value={selectedStaffCode}
                        onChange={(e) => setSelectedStaffCode(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="staff_accountant_1">Staff Accountant (Account Staff 1)</option>
                        <option value="staff_accountant_2">Staff Accountant (Account Staff 2)</option>
                        <option value="staff_accountant_3">Staff Accountant (Account Staff 3)</option>
                        <option value="staff_accountant_4">Staff Accountant (Account Staff 4)</option>
                        <option value="staff_accountant_5">Staff Accountant (Account Staff 5)</option>
                        <option value="staff_accountant_6">Staff Accountant (Account Staff 6)</option>
                        <option value="staff_accountant_7">Staff Accountant (Account Staff 7)</option>
                      </select>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="autoApproveCheck"
                          checked={autoApproveFlag}
                          onChange={(e) => setAutoApproveFlag(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="autoApproveCheck" className="text-xs text-slate-600 select-none">
                          Auto-Approve flag (Audit tracked)
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      {treasuryRequests.filter((r) => r.status === 'PENDING_CONFIRMATION').length > 0 ? (
                        <div className="space-y-2">
                          {treasuryRequests
                            .filter((r) => r.status === 'PENDING_CONFIRMATION')
                            .slice(0, 2)
                            .map((pendingReq) => (
                              <Button
                                key={pendingReq.id}
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => handleConfirmByTreasuryStaff(pendingReq.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                              >
                                Confirm #{pendingReq.requestReference} ({pendingReq.amountFIC} FIC)
                              </Button>
                            ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No pending requests awaiting Treasury Staff confirmation.</p>
                      )}
                    </div>
                  </div>

                  {/* CFO Final Approval Panel */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        2. Executive CFO Final Approval
                      </span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                        Root Hardcoded
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                      <p className="font-bold text-slate-900">{PLATFORM_OWNERSHIP.coFounder.name}</p>
                      <p className="text-[11px] text-amber-800 font-medium">Chief Financial Officer (CFO), Co-Founder, Admin-1</p>
                      <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                        {PLATFORM_OWNERSHIP.coFounder.rootMasterSeal?.map((seal, i) => (
                          <div key={i} className="text-emerald-700 font-semibold">{seal}</div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      {treasuryRequests.filter((r) => r.status === 'CONFIRMED_BY_TREASURY').length > 0 ? (
                        <div className="space-y-2">
                          {treasuryRequests
                            .filter((r) => r.status === 'CONFIRMED_BY_TREASURY')
                            .slice(0, 2)
                            .map((confirmedReq) => (
                              <Button
                                key={confirmedReq.id}
                                size="sm"
                                disabled={isSubmitting}
                                onClick={() => handleCfoFinalApproval(confirmedReq.id)}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md"
                              >
                                CFO Approve #{confirmedReq.requestReference} (Deduct Wallet 004 & Release)
                              </Button>
                            ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No confirmed requests awaiting CFO authorization.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: SOVEREIGN VAULT WATERFALL DEPLETION STATUS */}
            <TabsContent value="vault_depletion" className="space-y-6">
              <Card className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Sovereign Vault Waterfall Depletion Protocol
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Platform Rule: Wallet 004 Treasury & Seed Sale must be depleted before Wallet 003, then Wallet 002, then Wallet 001.
                    New FIC minting is strictly locked until all vaults are depleted and SuperAdmin Founder approval is sealed.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sovereignVaults.map((vault) => {
                    const pctRemaining = vault.initialAllocationFIC > 0
                      ? (vault.balanceFIC / vault.initialAllocationFIC) * 100
                      : 100;
                    return (
                      <div
                        key={vault.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          vault.vaultNumber === '004'
                            ? 'bg-amber-500/10 border-amber-500/40 ring-2 ring-amber-400/20'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            vault.vaultNumber === '004' ? 'bg-amber-200 text-amber-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            Priority {vault.priorityOrder}: {vault.vaultNumber === '004' ? 'Depleting 1st' : `Depleting ${vault.priorityOrder}th`}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">Vault {vault.vaultNumber}</span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-2">
                          {vault.vaultName}
                        </h4>

                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-500">Balance:</span>
                            <span className="font-bold text-slate-900">{vault.balanceFIC.toLocaleString()} FIC</span>
                          </div>

                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                vault.vaultNumber === '004' ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, pctRemaining))}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>Depleted: {vault.depletedFIC.toLocaleString()} FIC</span>
                            <span>Cap: {vault.initialAllocationFIC.toLocaleString()} FIC</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600">
                          <span className="font-semibold block text-slate-700">Custodial Multi-Sig:</span>
                          <span className="text-slate-500 text-[10px] line-clamp-1">{vault.custodianTitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">SuperAdmin Founder Minting Gate</span>
                    <p className="mt-0.5 text-purple-800">
                      Before minting new FIC into circulation, Wallet 004, Wallet 003, Wallet 002, and Wallet 001 must be fully exhausted
                      and statutory approval granted by Platform Founder & Owner <strong>Mr. Mbah Israel Obinna</strong>.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 3: GENERAL LEDGER TRANSACTIONS */}
            <TabsContent value="tx_history" className="space-y-6">
              <Card className="bg-white border border-slate-200/80 shadow-xs rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-lg font-bold text-slate-900">General Ledger Activity</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Cryptographic record of deposits, transfers, and disbursements verified on PostgreSQL.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                      <p className="text-center py-10 text-slate-400 text-xs">No transactions recorded.</p>
                    ) : (
                      transactions.map((tx) => (
                        <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              tx.type === 'received' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {tx.type === 'received' ? '↓' : '↑'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-xs">{tx.description || 'Transaction'}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{tx.date} • Ref #{String(tx.id)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-xs ${tx.type === 'received' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'received' ? '+' : '-'}{tx.amount} FIC
                            </p>
                            <span className="text-[10px] text-slate-400 capitalize">{tx.status || 'completed'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FUND WALLET VIA ALTERNATIVE BANK SOVEREIGN RAIL                  */}
      {/* ========================================================================= */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-widest block">
                  Official Dedicated Treasury Rail
                </span>
                <h3 className="text-xl font-black text-slate-900">Fund Wallet via Alternative Bank</h3>
              </div>
              <button
                onClick={() => setShowFundModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Bank details quick card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-mono text-xs space-y-3">
              <div className="flex justify-between items-center text-amber-400">
                <span className="font-bold">Alternative Bank</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  CBN Supervised
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-amber-300">0514108422</span>
                  <button
                    onClick={copyAccountNumber}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded text-amber-300"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-sans">Account Name:</span>
                <span className="font-semibold text-white">FingerMobile Protocol Communication</span>
              </div>
            </div>

            {/* Funding Form */}
            <form onSubmit={handleSubmitTreasuryFunding} className="space-y-4 text-xs">
              {/* Rate Tier Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pricing Tier & Vault Allocation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRateTypeChange('treasury_seed')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      fundRateType === 'treasury_seed'
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-amber-950 block">Wallet 004 Seed Tier</span>
                    <span className="text-amber-800 font-mono text-[11px]">₦65.00 / FIC ($0.05)</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Depleted 1st</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateTypeChange('standard')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      fundRateType === 'standard'
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-indigo-950 block">Standard Protocol Rate</span>
                    <span className="text-indigo-800 font-mono text-[11px]">₦650.00 / FIC ($0.50)</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Official Anchor</span>
                  </button>
                </div>
              </div>

              {/* Amount Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity in FIC</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={fundAmountFic}
                    onChange={(e) => handleFicAmountChange(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (NGN)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={fundAmountNgn}
                    onChange={(e) => handleNgnAmountChange(e.target.value)}
                    placeholder="e.g. 32500"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Depositor Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Depositor Full Name</label>
                  <input
                    type="text"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="As shown on your bank receipt"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Depositor Bank</label>
                  <select
                    value={depositorBank}
                    onChange={(e) => setDepositorBank(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transaction Reference & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank Reference / Teller No.</label>
                  <input
                    type="text"
                    value={bankTxRef}
                    onChange={(e) => setBankTxRef(e.target.value)}
                    placeholder="e.g. ALT/20261014/99120"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient Email (PDF Delivery)</label>
                  <input
                    type="email"
                    value={receiptEmail}
                    onChange={(e) => setReceiptEmail(e.target.value)}
                    placeholder="Where receipt will be sent"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Deposit Memo</label>
                <input
                  type="text"
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="e.g. Alternative Bank Sovereign Rail Direct Transfer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600">
                Payment will be confirmed at MasterDashboard Accounts by Treasury Staff (Staff 1-7),
                finally approved by Executive CFO Mrs. Mbah Eunice Emonena, deducted from Wallet 004,
                and an official PDF receipt will be dispatched to your email.
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl"
                  onClick={() => setShowFundModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-md"
                >
                  {isSubmitting ? 'Registering...' : 'Submit Deposit Proof'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 4-TIER ACCOUNTING & TREASURY ROLES DIRECTORY                     */}
      {/* ========================================================================= */}
      {showRolesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                  Corporate Governance & Oversight Structure
                </span>
                <h3 className="text-2xl font-black text-slate-900">Financial, Accounting & Treasury Roles Directory</h3>
              </div>
              <button
                onClick={() => setShowRolesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* CFO Root Hardcoded Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-sm text-slate-900">{PLATFORM_OWNERSHIP.coFounder.name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-950">
                  Root Master Seal Hardcoded
                </span>
              </div>
              <p className="text-xs text-amber-900 font-semibold">{PLATFORM_OWNERSHIP.coFounder.roleBadge}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                {PLATFORM_OWNERSHIP.coFounder.rootMasterSeal?.map((seal, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <span>{seal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Tiers List */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {[
                { title: 'Executive & Leadership Roles', category: 'EXECUTIVE_LEADERSHIP' },
                { title: 'Management & Supervisory Roles', category: 'MANAGEMENT_SUPERVISORY' },
                { title: 'Professional & Mid-Level Roles', category: 'PROFESSIONAL_MIDLEVEL' },
                { title: 'Entry-Level & Support Roles', category: 'ENTRY_SUPPORT' }
              ].map((tier) => {
                const roles = FINANCIAL_ROLES_TAXONOMY.filter((r) => r.category === tier.category);
                return (
                  <div key={tier.category} className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                      {tier.title} ({roles.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <div key={role.roleCode} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{role.roleName}</span>
                            <span className="font-mono text-[10px] text-slate-400">{role.roleCode}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{role.responsibilities}</p>
                          <div className="flex gap-2 pt-1">
                            {role.canConfirmPayment && (
                              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                                Confirms Alternative Bank
                              </span>
                            )}
                            {role.canFinalApprove && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                                Final CFO Authorization
                              </span>
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
              <Button onClick={() => setShowRolesModal(false)} className="rounded-2xl font-bold text-xs">
                Close Directory
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WITHDRAW MODAL                                                   */}
      {/* ========================================================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900">Withdraw to Bank</h3>
            <p className="text-xs text-gray-500">Available balance: {ficBalance.toLocaleString()} FIC</p>
            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  max={ficBalance}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bank Destination</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Alternative Bank">Alternative Bank (0514108422)</option>
                  <option value="Zenith Bank">Zenith Bank (0123456789)</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (0987654321)</option>
                  <option value="Access Bank">Access Bank (0555666777)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl">
                  {isSubmitting ? 'Processing...' : 'Withdraw'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SEND MONEY MODAL                                                 */}
      {/* ========================================================================= */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900">Send FIC Tokens</h3>
            <p className="text-xs text-gray-500">Transfer instantly to any FingerMobile member.</p>
            <form onSubmit={handleSendMoney} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Recipient Address or Member ID</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x819... or 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  max={ficBalance}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setShowSendModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl">
                  {isSubmitting ? 'Sending...' : 'Confirm Transfer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: RECEIVE MODAL & QR CODE                                          */}
      {/* ========================================================================= */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl text-center space-y-4 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900">Receive FIC</h3>
            <p className="text-xs text-gray-500">Share your protocol wallet address to receive funds.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl my-4 text-center">
              <div className="w-32 h-32 mx-auto bg-slate-200 rounded-xl flex items-center justify-center mb-3">
                <QrCodeIcon className="w-16 h-16 text-slate-500" />
              </div>
              <p className="text-xs font-mono text-gray-800 break-all select-all">{walletAddress || '0xDEF482...987A21'}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => setShowReceiveModal(false)}>
                Close
              </Button>
              <Button
                type="button"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress || '0xDEF482...987A21');
                  toast({ title: 'Copied!', description: 'Address copied to clipboard.' });
                }}
              >
                Copy Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WalletPage;
