import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import {
  QuestionMarkCircleIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '../../icons';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Protocol & Architecture',
    question: 'What is the FingerMobile Protocol™?',
    answer: 'The FingerMobile Protocol is a unified decentralized infrastructure fusing peer-to-peer sovereign identity, high-speed communication rails, creative content monetization (Stercs Studio), and the Infinite Coin (FIC) financial settlement vault.'
  },
  {
    id: 'faq-2',
    category: 'Protocol & Architecture',
    question: 'How does FingerMobile ensure member privacy?',
    answer: 'FingerMobile complies with the Nigeria Data Protection Act (NDPA 2023) and global GDPR regulations. Personal identities utilize asymmetric enclave cryptography so that passwords and raw biometric traits are never stored on centralized servers.'
  },
  {
    id: 'faq-3',
    category: 'FIC Vault & Payments',
    question: 'What is Infinite Coin (FIC)?',
    answer: 'Infinite Coin (FIC) is the internal utility and settlement token of the FingerMobile ecosystem. It allows instant micro-payments, creator tipping, video streaming royalties, and merchandise checkout with sub-second finality.'
  },
  {
    id: 'faq-4',
    category: 'FIC Vault & Payments',
    question: 'How do fiat payouts work?',
    answer: 'You can convert your accumulated FIC into local fiat (such as Nigerian Naira or USD) directly within your FIC Vault. Payouts are routed through regulated financial payment gateways (Paystack, Monnify, CBN rails) directly to verified commercial bank accounts.'
  },
  {
    id: 'faq-5',
    category: 'Security & Enclave',
    question: 'What should I do if I lose access to my device?',
    answer: 'Because FingerMobile uses sovereign cryptography, you can restore your account using your multi-factor recovery credentials, registered backup email, or guardian social recovery protocols.'
  },
  {
    id: 'faq-6',
    category: 'Creator & Media',
    question: 'How does Stercs Studio verify copyright?',
    answer: 'Stercs Studio automatically computes perceptual cryptographic hashes across audio and video tracks prior to indexing. This prevents unauthorized duplicate re-uploads and ensures genuine creators receive accurate view compensation.'
  },
  {
    id: 'faq-7',
    category: 'Legal & Compliance',
    question: 'How do I submit a Data Subject Request (DSR)?',
    answer: 'You can submit an official DSR through our automated compliance desk at /privacy/data-subject-request. You can request access, data portability, correction of records, or permanent erasure.'
  }
];

const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const categories = ['All', 'Protocol & Architecture', 'FIC Vault & Payments', 'Security & Enclave', 'Creator & Media', 'Legal & Compliance'];

  const filteredFaqs = FAQS_DATA.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <MainLayout pageTitle="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-500">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-950 dark:text-blue-300 text-xs font-bold rounded-full mb-4 border border-blue-400 dark:border-blue-800   font-black">
            <QuestionMarkCircleIcon className="w-4 h-4" />
            <span>Official Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-base text-slate-700 dark:text-slate-300 font-medium max-w-xl mx-auto">
            Everything you need to know about the FingerMobile platform, FIC economy, cryptographic enclaves, and compliance.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords (e.g. FIC, payout, privacy, security)..."
              className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQ list */}
        <div className="space-y-3 mb-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1">
                        {faq.category}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-slate-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 font-medium text-sm">No answers found matching "{search}".</p>
            </div>
          )}
        </div>

        {/* Bottom Help Desk Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Have a question not listed here?</h3>
            <p className="text-blue-200 text-xs mt-1">
              Our 24/7 technical and protocol engineering desk is ready to help.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact-support"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Open Ticket
            </Link>
            <Link
              to="/contact-us"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-700 text-xs font-bold rounded-xl border border-white/20 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
