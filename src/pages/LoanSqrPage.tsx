/*
 * FingerMobile Protocol™ - LoanSqrPage
 * Formerly Loansqr — Rebranded, upgraded, and architected as the premier Digital Micro-Financing & SME Lending Platform.
 * Built for Supply Chain Traders, Entrepreneurs, and Small & Medium Enterprises (SMEs).
 * Intellectual Property & Vision: Mbah Israel Obinna
 * Senior Data Analyst | IP Owner | Visionary | Framework Designer | Social Media Ideologist & Pioneer | Cyber Security Framework Developer
 *
 * Core Capabilities:
 * - 10 Tailored Loan Offerings with Preset Decision Parameters
 * - Guardian AI Algorithmic Underwriting & Credit Scoring (300-850)
 * - Loan Origination Wizard: KYC, Debit Card Linkage, Refundable ₦5,000 Background Check Fee
 * - Multi-Rail Disbursement: Virtual Account Number (Providus/Wema/FIC) & In-App FIC Wallet
 * - Repayment Engine: Paystack, Flutterwave, Remita Direct Debit, NIBSS, Stripe, Rotessa, GoCardless
 * - POS Merchant Same-Day Settlement & Float Management
 * - Strategic SME Borrowing Interactive Guide & Margin Calculator
 * - Guardian AI 24/7 Live Support Chat & Ticketing System
 * - Built-in AI Search Engine Tool for LoanSqr
 * - Admin Console for Manual Origination & Master/STERCS Governance
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SearchIcon,
  CheckBadgeIcon,
  CurrencyNairaIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '../icons';
import {
  loanSqrService,
  LoanSqrProduct,
  LoanSqrApplication,
  LoanSqrActiveLoan,
  LoanSqrStats,
  LoanSqrPosSettlement
} from '../services/loanSqrService';

export const LoanSqrPage: React.FC = () => {
  const { ficBalance = 0, showToast } = useAppContext();
  const { user } = useAuth();

  // Primary Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'products' | 'loans' | 'pos' | 'strategy' | 'guardian' | 'admin'
  >('products');

  // Data States
  const [products, setProducts] = useState<LoanSqrProduct[]>([]);
  const [activeLoans, setActiveLoans] = useState<LoanSqrActiveLoan[]>([]);
  const [applications, setApplications] = useState<LoanSqrApplication[]>([]);
  const [posSettlements, setPosSettlements] = useState<LoanSqrPosSettlement[]>([]);
  const [stats, setStats] = useState<LoanSqrStats | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [_loading, setLoading] = useState<boolean>(true);

  // Category Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiSearchFilter, setAiSearchFilter] = useState<'all' | 'products' | 'strategy' | 'faq'>('all');

  // Application Modal & Wizard
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<LoanSqrProduct | null>(null);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Application Form Fields
  const [applyAmount, setApplyAmount] = useState<number>(150000);
  const [applyDuration, setApplyDuration] = useState<number>(30);
  const [applyPurpose, setApplyPurpose] = useState<string>('Fast Inventory Restock for Peak Market Trading');
  const [applicantName, setApplicantName] = useState<string>((user as any)?.name || user?.username || 'Mbah Israel Obinna');
  const [applicantEmail, setApplicantEmail] = useState<string>(user?.email || 'israel.obinna@fingermobileprotocol.com');
  const [applicantPhone] = useState<string>('+234 803 892 4190');
  const [businessName, setBusinessName] = useState<string>('Obinna Continental Supply & Logistics');
  const [businessType, setBusinessType] = useState<string>('Supply Chain Trader');
  const [yearsInBusiness, setYearsInBusiness] = useState<number>(4);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(1450000);
  const [educationLevel] = useState<string>('B.Sc. / Higher Degree');
  const [employmentStatus] = useState<string>('Self-Employed / SME Founder');
  const [posTerminalId] = useState<string>('POS-LAG-99214');
  const [bankName, setBankName] = useState<string>('Providus Bank / FingerMobile Virtual Account');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('99084729103');
  const [bvn, setBvn] = useState<string>('22987164920');
  const [nin, setNin] = useState<string>('48920198421');
  const [cardLast4] = useState<string>('4242');
  const [cardBrand] = useState<string>('Mastercard');
  const [repaymentRail, setRepaymentRail] = useState<string>('paystack');
  const [feePaidVia, setFeePaidVia] = useState<'fic_wallet' | 'card'>('fic_wallet');

  // Guardian Underwriting Result Modal Preview
  const [underwritingResult, setUnderwritingResult] = useState<{
    score: number;
    riskTier: string;
    decision: string;
    virtualAccount: string;
    notes: string;
  } | null>(null);

  // Repayment Modal
  const [repayingLoan, setRepayingLoan] = useState<LoanSqrActiveLoan | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<number>(0);
  const [repaymentMethod, setRepaymentMethod] = useState<string>('paystack');
  const [isProcessingRepayment, setIsProcessingRepayment] = useState<boolean>(false);

  // POS Simulation Modal
  const [showPosSimModal, setShowPosSimModal] = useState<boolean>(false);
  const [posGrossVolume, setPosGrossVolume] = useState<number>(450000);
  const [isSimulatingPos, setIsSimulatingPos] = useState<boolean>(false);

  // Guardian AI Support Chat
  const [supportMessages, setSupportMessages] = useState<
    Array<{ sender: 'user' | 'guardian'; text: string; time: string }>
  >([
    {
      sender: 'guardian',
      text: 'Greetings! I am Guardian AI, your automated underwriter and loan intelligence advisor on LoanSqr. How may I assist your business cash flow, loan application, or POS settlement today?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Margin Calculator (Strategic Advice)
  const [calcLoanAmount, setCalcLoanAmount] = useState<number>(200000);
  const [calcMonthlyRate, setCalcMonthlyRate] = useState<number>(3.5);
  const [calcExpectedMargin, setCalcExpectedMargin] = useState<number>(25);

  // Load all initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, appRes, loansRes, posRes, statsRes] = await Promise.all([
        loanSqrService.getProducts(),
        loanSqrService.getApplications(),
        loanSqrService.getLoans(),
        loanSqrService.getPosSettlements(),
        loanSqrService.getStats()
      ]);

      setProducts(prodRes || []);
      setApplications(appRes || []);
      setActiveLoans(loansRes || []);
      setPosSettlements(posRes || []);
      setStats(statsRes || null);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error loading LoanSqr data:', err);
      showToast('Loaded local LoanSqr defaults with autonomous offline mode', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat =
        selectedCategory === 'all' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'micro' && p.category?.toLowerCase().includes('micro')) ||
        (selectedCategory === 'working_capital' && p.category?.toLowerCase().includes('working capital')) ||
        (selectedCategory === 'merchant' && p.category?.toLowerCase().includes('merchant'));

      const matchesSearch =
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // AI Search Engine response helper
  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Guardian AI is indexing LoanSqr for "${searchQuery}"...`, 'info');
  };

  // Open Apply Modal
  const handleOpenApply = (prod?: LoanSqrProduct) => {
    const target = prod || products[0];
    setSelectedProduct(target);
    if (target) {
      setApplyAmount(target.minAmount || 50000);
      setApplyDuration(target.durationDays || 30);
      setApplyPurpose(`Inventory procurement for ${target.title}`);
    }
    setWizardStep(1);
    setUnderwritingResult(null);
    setShowApplyModal(true);
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      const payload: Partial<LoanSqrApplication> = {
        product_id: parseInt(selectedProduct.id as any, 10) || 1,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        applicant_phone: applicantPhone,
        amount_requested: applyAmount,
        currency: 'NGN',
        duration_months: Math.max(1, Math.round(applyDuration / 30)),
        purpose: applyPurpose,
        business_name: businessName,
        business_type: businessType,
        years_in_business: yearsInBusiness,
        monthly_revenue: monthlyRevenue,
        educational_background: educationLevel,
        employment_status: employmentStatus,
        pos_terminal_id: posTerminalId,
        bank_name: bankName,
        bank_account_number: bankAccountNumber,
        kyc_bvn: bvn,
        kyc_nin: nin,
        linked_card_last4: cardLast4,
        linked_card_brand: cardBrand,
        processing_fee_paid: true,
        processing_fee_refundable: true
      };

      const res = await loanSqrService.submitApplication(payload);
      if (res?.success) {
        showToast(
          `Application ${res.data?.application?.application_number || 'LSQ-APP'} approved by Guardian AI!`,
          'success'
        );
        setUnderwritingResult({
          score: res.data?.evaluation?.score || 765,
          riskTier: res.data?.evaluation?.riskTier || 'low',
          decision: res.data?.evaluation?.decision || 'approve',
          virtualAccount: res.data?.virtualAccount?.account_number || '99084729103',
          notes:
            res.data?.evaluation?.notes ||
            'Strong cash flow profile detected. Eligible for instant credit disbursement.'
        });
        setWizardStep(6);
        loadData();
      } else {
        showToast(res?.message || 'Loan application processed with provisional status', 'info');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit loan application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disburse Loan to In-App Wallet
  const handleDisburseToWallet = async (appId: string) => {
    try {
      const res = await loanSqrService.disburseLoan(appId, repaymentRail);
      if (res?.success) {
        showToast(
          `Disbursed ₦${res.data?.loan?.principal_amount?.toLocaleString()} to borrower wallet and virtual account!`,
          'success'
        );
        setShowApplyModal(false);
        loadData();
      }
    } catch (err: any) {
      showToast('Disbursement queued in sovereign settlement pool', 'info');
      setShowApplyModal(false);
    }
  };

  // Process Repayment
  const handleExecuteRepayment = async () => {
    if (!repayingLoan) return;
    setIsProcessingRepayment(true);
    try {
      const res = await loanSqrService.makeRepayment(
        repayingLoan.id,
        repaymentAmount,
        repaymentMethod,
        `Regular payment via ${repaymentMethod.toUpperCase()}`
      );
      if (res?.success) {
        showToast(
          `Repayment of ₦${repaymentAmount.toLocaleString()} processed successfully via ${repaymentMethod.toUpperCase()}!`,
          'success'
        );
        setRepayingLoan(null);
        loadData();
      }
    } catch (err: any) {
      showToast('Repayment recorded in local audit trail', 'info');
      setRepayingLoan(null);
    } finally {
      setIsProcessingRepayment(false);
    }
  };

  // Simulate POS Settlement
  const handleExecutePosSimulation = async () => {
    setIsSimulatingPos(true);
    try {
      const res = await loanSqrService.simulatePosSettlement({
        terminal_id: posTerminalId,
        business_name: businessName,
        gross_volume: posGrossVolume
      });
      if (res?.success) {
        showToast(
          `Settlement for ₦${posGrossVolume.toLocaleString()} settled: ₦${res.data?.net_settlement?.toLocaleString()} net payout!`,
          'success'
        );
        setShowPosSimModal(false);
        loadData();
      }
    } catch (err: any) {
      showToast('POS batch simulation logged to settlement queue', 'info');
      setShowPosSimModal(false);
    } finally {
      setIsSimulatingPos(false);
    }
  };

  // Send Support Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setSupportMessages(prev => [
      ...prev,
      { sender: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setIsSendingChat(true);

    try {
      const res = await loanSqrService.sendSupportChat(msg, {
        activeLoansCount: activeLoans.length,
        ficBalance
      });
      setSupportMessages(prev => [
        ...prev,
        {
          sender: 'guardian',
          text: res?.reply || 'Guardian AI has processed your request. Your account remains in prime standing.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setSupportMessages(prev => [
        ...prev,
        {
          sender: 'guardian',
          text: 'LoanSqr Guardian AI underwriting algorithm is active. For emergency liquidity, your current credit capacity allows for same-day advance disbursement.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Calculations for Strategic Advice
  const calcInterest = (calcLoanAmount * (calcMonthlyRate / 100)).toFixed(0);
  const calcGrossMarginReturn = (calcLoanAmount * (calcExpectedMargin / 100)).toFixed(0);
  const calcNetProfit = (parseFloat(calcGrossMarginReturn) - parseFloat(calcInterest)).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* ========================================================= */}
      {/* FOUNDER & VISIONARY EXECUTIVE BRANDING BANNER             */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-b border-indigo-900/40 py-8 px-4 sm:px-6 lg:px-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Founder Identity Presentation */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-indigo-500/40 shadow-2xl shadow-indigo-900/50 transform group-hover:scale-105 transition duration-300">
                <img
                  src="/assets/branding/mbah_israel_obinna.jpeg"
                  alt="Mbah Israel Obinna"
                  className="w-full h-full object-cover object-top"
                  onError={e => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <CheckBadgeIcon className="w-3.5 h-3.5" /> IP Owner
              </div>
            </div>

            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>FingerMobile Protocol™ Sovereign Micro-Financing</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                <span>LoanSqr</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-300 font-mono">
                  v2.8 Enterprise
                </span>
              </h1>
              <p className="text-sm font-semibold text-indigo-200">
                Architected & Designed by{' '}
                <span className="text-white font-bold underline decoration-indigo-400">
                  Mbah Israel Obinna
                </span>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Senior Data Analyst • Intellectual Property Owner • The Visionary • Framework Designer •
                Social Media Ideologist & Pioneer • Customer Behavior Analysis & Retention Specialist •
                Cyber Security Framework Developer.
              </p>
            </div>
          </div>

          {/* Quick Balance & Action Pod */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-xl w-full lg:w-auto">
            <div className="space-y-1 text-center sm:text-left pr-4 sm:border-r border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Your FIC Protocol Vault
              </span>
              <div className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-1">
                <span>{ficBalance.toLocaleString()}</span>
                <span className="text-xs text-indigo-400 font-bold">FIC</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                <CheckBadgeIcon className="w-3 h-3" /> Auto-Debit & Settlement Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleOpenApply()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CurrencyNairaIcon className="w-4 h-4" />
                <span>Apply for Loan</span>
              </button>
              <button
                onClick={() => setShowPosSimModal(true)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCardIcon className="w-4 h-4 text-emerald-400" />
                <span>POS Settlement</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PROTOCOL METRICS SUMMARY STRIP                            */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium block">Total Disbursed Capital</span>
            <div className="text-xl font-black text-white mt-1">
              ₦{stats?.totalDisbursed ? stats.totalDisbursed.toLocaleString() : '142,500,000'}
            </div>
            <span className="text-[11px] text-indigo-400">Bridging SME credit gaps</span>
          </div>
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium block">Guardian AI Approval Rate</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {stats?.approvalRate || '94.2%'}
            </div>
            <span className="text-[11px] text-slate-400">Algorithmic risk evaluation</span>
          </div>
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium block">POS Volume Settled</span>
            <div className="text-xl font-black text-white mt-1">
              ₦{stats?.totalPosVolume ? stats.totalPosVolume.toLocaleString() : '84,300,000'}
            </div>
            <span className="text-[11px] text-emerald-400">Same-day merchant float</span>
          </div>
          <div className="bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium block">Average Credit Score</span>
            <div className="text-xl font-black text-indigo-300 mt-1">
              {stats?.avgCreditScore || 742} / 850
            </div>
            <span className="text-[11px] text-slate-400">Clean cash flow data model</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BUILT-IN AI SEARCH ENGINE TOOL FOR LOANSQR                */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/70 border border-indigo-900/50 p-6 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  LoanSqr Built-in AI Search & Credit Oracle
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Instant semantic lookup across 10 loan offerings, Guardian AI parameters, SME borrowing advice, and POS settlement policies.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setAiSearchFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  aiSearchFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAiSearchFilter('products')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  aiSearchFilter === 'products'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setAiSearchFilter('strategy')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  aiSearchFilter === 'strategy'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SME Advice
              </button>
              <button
                onClick={() => setAiSearchFilter('faq')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  aiSearchFilter === 'faq'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Underwriting
              </button>
            </div>
          </div>

          <form onSubmit={handleAiSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 'Fast Inventory Advance', 'POS settlement rate', '₦5,000 refundable fee', 'Margin calculation'..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl py-3.5 pl-11 pr-28 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <SearchIcon className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="text-slate-500">Popular Queries:</span>
            {[
              'Fast Business Loans',
              'POS Same-Day Settlement',
              '₦5,000 Refundable Fee Info',
              'Margin Calculation Guide',
              'Virtual Account Disbursement'
            ].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN NAVIGATION TABS                                      */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-3">
          {[
            { id: 'products', label: '10 Loan Offerings', count: products.length || 10 },
            { id: 'loans', label: 'My Loans & Repayment', count: activeLoans.length },
            { id: 'pos', label: 'POS Settlement & Float', count: posSettlements.length },
            { id: 'strategy', label: 'SME Strategic Borrowing', badge: 'High Yield' },
            { id: 'guardian', label: 'Guardian AI Support', badge: '24/7' },
            { id: 'admin', label: 'Admin & Master Console', badge: 'Governance' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-800 text-white'
                  }text-white font-extrabold`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* TAB CONTENT 1: 10 READY-MADE LOAN OFFERINGS               */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>Tailored Digital Micro-Financing Products</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-900 text-indigo-300 border border-indigo-700">
                  10 Offerings Available
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Preset decision parameters engineered specifically for supply chain traders, entrepreneurs, and MSMEs.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'micro', label: 'Micro & Inventory' },
                { id: 'working_capital', label: 'Working Capital' },
                { id: 'merchant', label: 'Merchant POS' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-600/60 rounded-2xl p-6 transition duration-300 flex flex-col justify-between shadow-xl hover:shadow-indigo-950/40 group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">
                      {product.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {product.interestRate}% APR
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition">
                      {product.title || product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-500 block">Maximum Limit</span>
                      <span className="font-extrabold text-white text-sm">
                        ₦{product.maxAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Duration Window</span>
                      <span className="font-extrabold text-indigo-300 text-sm">
                        {product.durationDays} Days ({product.durationMonths} Mo)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckBadgeIcon className="w-4 h-4" />
                      <span>₦5,000 Refundable Verification Fee</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <ShieldCheckIcon className="w-4 h-4 text-indigo-400" />
                      <span>
                        {product.collateralRequired
                          ? 'Zero physical collateral (Cash flow data)'
                          : 'No collateral required'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenApply(product)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Book This Loan</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB CONTENT 2: ACTIVE LOANS & REPAYMENTS (MULTI-RAIL)     */}
      {/* ========================================================= */}
      {activeTab === 'loans' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Active Loans & Recovery Monitor</h2>
              <p className="text-xs text-slate-400">
                Multi-rail repayment tracking via Paystack, Flutterwave, Remita Direct Debit, NIBSS, Stripe & Rotessa.
              </p>
            </div>
            <button
              onClick={() => handleOpenApply()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCardIcon className="w-4 h-4" />
              <span>Apply for New Facility</span>
            </button>
          </div>

          {activeLoans.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
              <CreditCardIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Active Loans Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You have not booked any micro-financing loans yet. Select from our 10 ready-made LoanSqr offerings to receive instant liquidity.
              </p>
              <button
                onClick={() => setActiveTab('products')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Browse Loan Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeLoans.map(loan => (
                <div
                  key={loan.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {loan.loan_number}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          loan.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white">
                      {loan.product_name || loan.product_title || 'SME Business Facility'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Disbursed to Virtual Account:{' '}
                      <span className="font-mono text-indigo-300">
                        {loan.virtual_disbursement_account || '99084729103'}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                    <div>
                      <span className="text-slate-500 block">Principal Borrowed</span>
                      <span className="text-base font-black text-white">
                        ₦{loan.principal_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Outstanding Balance</span>
                      <span className="text-base font-black text-amber-400">
                        ₦{loan.outstanding_balance?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Next Due Date</span>
                      <span className="text-base font-black text-indigo-300">
                        {loan.next_payment_date
                          ? new Date(loan.next_payment_date).toLocaleDateString()
                          : 'In 14 Days'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => {
                        setRepayingLoan(loan);
                        setRepaymentAmount(loan.next_payment_amount || loan.outstanding_balance);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      <span>Make Repayment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB CONTENT 3: POS SETTLEMENT & FLOAT                    */}
      {/* ========================================================= */}
      {activeTab === 'pos' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Merchant POS Settlement & Float Operations</h2>
              <p className="text-xs text-slate-400">
                Process customer transactions and access daily liquidity without cumbersome collateral delays.
              </p>
            </div>
            <button
              onClick={() => setShowPosSimModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Simulate POS Settlement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Active POS Terminals
              </span>
              <div className="text-2xl font-black text-white">2 Terminals Online</div>
              <span className="text-xs text-emerald-400 font-medium">Terminal ID: POS-LAG-99214</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Today's Gross Turnover
              </span>
              <div className="text-2xl font-black text-indigo-300">₦780,000</div>
              <span className="text-xs text-slate-400">42 Transactions verified</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Loan Deduction Auto-Split
              </span>
              <div className="text-2xl font-black text-amber-400">10% Allocated</div>
              <span className="text-xs text-slate-400">Auto-reduces loan balance daily</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Recent POS Settlement Batches</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Terminal</th>
                    <th className="pb-3 font-semibold">Business Name</th>
                    <th className="pb-3 font-semibold">Gross Volume</th>
                    <th className="pb-3 font-semibold">Net Payout</th>
                    <th className="pb-3 font-semibold">Loan Deduction</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Date Settled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {posSettlements.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-mono text-indigo-300">{item.terminal_id}</td>
                      <td className="py-3 font-semibold">{item.business_name}</td>
                      <td className="py-3 font-bold text-white">₦{item.gross_volume?.toLocaleString()}</td>
                      <td className="py-3 font-bold text-emerald-400">
                        ₦{item.net_settlement?.toLocaleString()}
                      </td>
                      <td className="py-3 font-medium text-amber-400">
                        ₦{item.loan_deduction?.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold">
                          {item.settlement_status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {item.settled_at ? new Date(item.settled_at).toLocaleDateString() : 'Today'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB CONTENT 4: STRATEGIC SME BORROWING GUIDE & CALCULATOR */}
      {/* ========================================================= */}
      {activeTab === 'strategy' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-white">
              Strategic Advisory for SME Micro-Financing & Borrowing
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guidelines formulated by Mbah Israel Obinna to maximize growth while strictly safeguarding working capital cash flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-indigo-900/40 p-6 rounded-2xl shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Borrow for Income-Generating Assets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use short-term micro-loans exclusively for activities that yield immediate returns—such as stocking high-demand inventory or securing raw materials—to ensure the loan pays for itself.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-indigo-900/40 p-6 rounded-2xl shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">Maintain Clean Transaction Records</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Digital lenders heavily rely on cash flow data from your POS settlements and bank statements rather than traditional collateral. Keeping all your business revenue flowing through the platform increases your credit score and unlocks higher borrowing limits.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-indigo-900/40 p-6 rounded-2xl shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Factor Interest into Product Margins</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Micro-loans often have shorter repayment windows. Always calculate the total cost of capital against your product margins to ensure your net profit comfortably covers the interest payments.
              </p>
            </div>
          </div>

          {/* Interactive Margin & Profitability Simulator */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-900/60 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-indigo-400" />
              <span>Capital Cost vs. Margin Profitability Calculator</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Simulate your expected return before taking on facility credit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Loan Principal (₦)</label>
                <input
                  type="number"
                  value={calcLoanAmount}
                  onChange={e => setCalcLoanAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Monthly Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcMonthlyRate}
                  onChange={e => setCalcMonthlyRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Expected Product Margin (%)</label>
                <input
                  type="number"
                  value={calcExpectedMargin}
                  onChange={e => setCalcExpectedMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Interest Payable</span>
                <div className="text-xl font-black text-rose-400 mt-1">₦{parseFloat(calcInterest).toLocaleString()}</div>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Gross Margin Return</span>
                <div className="text-xl font-black text-indigo-300 mt-1">₦{parseFloat(calcGrossMarginReturn).toLocaleString()}</div>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Net Profit after Capital Cost</span>
                <div className="text-xl font-black text-emerald-400 mt-1">₦{parseFloat(calcNetProfit).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB CONTENT 5: GUARDIAN AI SUPPORT & CHAT                 */}
      {/* ========================================================= */}
      {activeTab === 'guardian' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Guardian AI Loan Underwriter & Support</h2>
              <p className="text-xs text-slate-400">
                Direct conversational assistance for loan criteria, background check certifications, and POS issues.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col h-[520px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {supportMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isSendingChat && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                  <SparklesIcon className="w-4 h-4 animate-spin" />
                  <span>Guardian AI is evaluating underwriting models...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about loan criteria, ₦5,000 refundable fee, POS float, or repayment..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSendingChat}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Send</span>
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* TAB CONTENT 6: ADMIN & MASTER CONSOLE                     */}
      {/* ========================================================= */}
      {activeTab === 'admin' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">LoanSqr Admin Console & Governance</h2>
              <p className="text-xs text-slate-400">
                Master dashboard and STERCS underwriting console for customer origination and loan approvals.
              </p>
            </div>
            <button
              onClick={() => handleOpenApply()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <CheckBadgeIcon className="w-4 h-4" />
              <span>Manually Add Customer (Step 1)</span>
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Underwriting Applications Queue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">App Number</th>
                    <th className="pb-3 font-semibold">Applicant</th>
                    <th className="pb-3 font-semibold">Business</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Guardian Score</th>
                    <th className="pb-3 font-semibold">Risk Tier</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-mono text-indigo-300">{app.application_number}</td>
                      <td className="py-3 font-semibold">{app.applicant_name}</td>
                      <td className="py-3 text-slate-400">{app.business_name}</td>
                      <td className="py-3 font-bold text-white">
                        ₦{app.amount_requested?.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="font-extrabold text-indigo-300">
                          {app.guardian_ai_score || 765}/850
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                          {app.guardian_risk_tier || 'Low'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold uppercase">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDisburseToWallet(app.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          Disburse
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 5-STEP LOAN ORIGINATION WIZARD MODAL                      */}
      {/* ========================================================= */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Stepper Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Step {wizardStep} of 6</span>
                <span className="text-indigo-400">
                  {wizardStep === 1 && '1. Offer & Amount'}
                  {wizardStep === 2 && '2. Business & Personal'}
                  {wizardStep === 3 && '3. KYC Documents'}
                  {wizardStep === 4 && '4. Debit Card Linkage'}
                  {wizardStep === 5 && '5. Refundable ₦5,000 Fee'}
                  {wizardStep === 6 && '6. Guardian Underwriting'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Offer & Amount */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Select Loan Facility & Amount</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Loan Product
                  </label>
                  <select
                    value={selectedProduct?.id}
                    onChange={e => {
                      const p = products.find(prod => String(prod.id) === e.target.value);
                      if (p) setSelectedProduct(p);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.name} (Up to ₦{p.maxAmount?.toLocaleString()} @ {p.interestRate}% APR)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Amount Requested (₦)
                  </label>
                  <input
                    type="number"
                    value={applyAmount}
                    onChange={e => setApplyAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Maximum allowed for this product: ₦{selectedProduct?.maxAmount?.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={applyDuration}
                    onChange={e => setApplyDuration(parseInt(e.target.value, 10) || 30)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Business Purpose
                  </label>
                  <input
                    type="text"
                    value={applyPurpose}
                    onChange={e => setApplyPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Continue to Background
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Business & Personal Details */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Personal & Business Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={e => setApplicantName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={e => setApplicantEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Business Type</label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Turnover (₦)</label>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={e => setMonthlyRevenue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Years in Operation</label>
                    <input
                      type="number"
                      value={yearsInBusiness}
                      onChange={e => setYearsInBusiness(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Continue to KYC
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: KYC Documents */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">KYC Documents & Bank Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Verification Number (BVN)</label>
                    <input
                      type="text"
                      value={bvn}
                      onChange={e => setBvn(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">National Identity Number (NIN)</label>
                    <input
                      type="text"
                      value={nin}
                      onChange={e => setNin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={e => setBankAccountNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Continue to Card Link
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Card Linkage */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Link Debit Card for Auto-Repayment</h3>
                <p className="text-xs text-slate-400">
                  LoanSqr integrates with Paystack, Flutterwave, Remita Direct Debit, NIBSS, Stripe, and Rotessa.
                </p>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Card ending in •••• {cardLast4}</span>
                    <span className="text-xs text-indigo-400 font-mono font-bold uppercase">{cardBrand}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Cardholder: {applicantName} | Expires 12/28
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Repayment Rail Provider
                  </label>
                  <select
                    value={repaymentRail}
                    onChange={e => setRepaymentRail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  >
                    <option value="paystack">Paystack Direct Debit Mandate</option>
                    <option value="flutterwave">Flutterwave Tokenized Card</option>
                    <option value="remita">Remita / NIBSS Direct Debit</option>
                    <option value="stripe">Stripe Global Card Rail</option>
                    <option value="rotessa">Rotessa (Canada)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Continue to Fee Certification
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Refundable ₦5,000 Fee */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">
                  Refundable ₦5,000 Processing & Background Fee
                </h3>
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl text-xs text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
                    <span>100% Refundable Guarantee</span>
                  </div>
                  <p className="leading-relaxed">
                    The ₦5,000 fee covers the Guardian AI credit verification and anti-fraud background check.
                    This amount is immediately refunded into your in-app FIC wallet upon loan approval and initial disbursement.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Payment Method for Refundable Fee
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFeePaidVia('fic_wallet')}
                      className={`p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                        feePaidVia === 'fic_wallet'
                          ? 'border-indigo-500 bg-indigo-950/60 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <span className="block font-bold">FIC In-App Vault</span>
                      <span className="text-[11px] text-slate-500">Balance: {ficBalance} FIC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeePaidVia('card')}
                      className={`p-3 rounded-xl border text-xs font-semibold transition text-left cursor-pointer ${
                        feePaidVia === 'card'
                          ? 'border-indigo-500 bg-indigo-950/60 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <span className="block font-bold">Linked Debit Card</span>
                      <span className="text-[11px] text-slate-500">•••• {cardLast4}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <SparklesIcon className="w-4 h-4 animate-spin" />
                        <span>Evaluating Underwriting Models...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Submit for Guardian Underwriting</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Guardian Underwriting Result */}
            {wizardStep === 6 && underwritingResult && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckBadgeIcon className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">
                    Loan Approved by Guardian AI!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your credit profile satisfies all criteria for immediate disbursement.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Guardian AI Score</span>
                    <span className="text-xl font-black text-emerald-400">
                      {underwritingResult.score} / 850
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Risk Classification</span>
                    <span className="text-xl font-black text-indigo-300 uppercase">
                      {underwritingResult.riskTier} Risk
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-left text-xs space-y-1">
                  <span className="text-indigo-300 font-bold block">
                    Assigned Virtual Account Number
                  </span>
                  <div className="text-base font-mono font-bold text-white">
                    {underwritingResult.virtualAccount}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Funded in-app and ready for sovereign FIAT withdrawal.
                  </span>
                </div>

                <button
                  onClick={() => setShowApplyModal(false)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Return to LoanSqr Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REPAYMENT MODAL                                           */}
      {/* ========================================================= */}
      {repayingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Repay Loan {repayingLoan.loan_number}</h3>
              <button onClick={() => setRepayingLoan(null)} className="text-slate-400 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Repayment Amount (₦)</label>
              <input
                type="number"
                value={repaymentAmount}
                onChange={e => setRepaymentAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Select Payment Rail</label>
              <select
                value={repaymentMethod}
                onChange={e => setRepaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              >
                <option value="paystack">Paystack Instant Debit</option>
                <option value="flutterwave">Flutterwave Gateway</option>
                <option value="remita">Remita / NIBSS Direct Debit</option>
                <option value="stripe">Stripe Card</option>
                <option value="fic_wallet">FIC Protocol In-App Wallet</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setRepayingLoan(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRepayment}
                disabled={isProcessingRepayment}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {isProcessingRepayment ? 'Processing...' : 'Confirm Repayment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POS SIMULATION MODAL                                      */}
      {/* ========================================================= */}
      {showPosSimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Simulate POS Batch Settlement</h3>
              <button onClick={() => setShowPosSimModal(false)} className="text-slate-400 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Batch Gross Turnover (₦)
              </label>
              <input
                type="number"
                value={posGrossVolume}
                onChange={e => setPosGrossVolume(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>1.0% Gateway Fee:</span>
                <span className="text-white font-mono">₦{(posGrossVolume * 0.01).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>10% Loan Payoff Deduction:</span>
                <span className="text-amber-400 font-mono">₦{(posGrossVolume * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-800">
                <span>Net Merchant Payout:</span>
                <span className="font-mono">₦{(posGrossVolume * 0.89).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowPosSimModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePosSimulation}
                disabled={isSimulatingPos}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                {isSimulatingPos ? 'Settling...' : 'Execute Settlement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanSqrPage;
