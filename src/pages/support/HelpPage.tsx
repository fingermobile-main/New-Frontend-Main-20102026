import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import {
  LifebuoyIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  LockIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '../../icons';

interface HelpTopic {
  id: string;
  category: string;
  title: string;
  summary: string;
  details: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'sec-1',
    category: 'Identity & Sovereignty',
    title: 'How does Biometric Sovereign Authentication work?',
    summary: 'FingerMobile uses hardware enclave cryptography and WebAuthn for passwordless security.',
    details: 'Your biometric signature never leaves your local device. An asymmetric cryptographic challenge is signed directly within your secure enclave and verified on our backend rails without exposing private credentials.'
  },
  {
    id: 'vault-1',
    category: 'FIC Vault & Monetization',
    title: 'How do I fund or withdraw from my FIC Vault?',
    summary: 'Deposit Naira/fiat via Paystack/Monnify or convert sovereign crypto assets seamlessly.',
    details: 'Navigate to the FIC Vault under your account settings. Select Deposit to generate instant bank transfer rails or debit checkout. Withdrawals settle within 15 minutes to verified local commercial banks under CBN statutory limits.'
  },
  {
    id: 'creator-1',
    category: 'Stercs Studio & Media',
    title: 'How are video royalties and copyright protected?',
    summary: 'Every media item published through Stercs Studio receives a cryptographic perceptual hash.',
    details: 'Our automated copyright scanner monitors broadcast streams and reels. When a match is detected against your registered copyright fingerprint, automated micro-royalties are directed directly to your FIC Vault.'
  },
  {
    id: 'sentinel-1',
    category: 'Sentinel Safety & Compliance',
    title: 'What should I do if my account receives a Sentinel Strike?',
    summary: 'Review the flagged content and submit an appeal to human moderation within 14 days.',
    details: 'Sentinel strikes are issued for community guideline violations. You can view full violation telemetry and submit an evidence appeal directly in your dashboard or by filing a ticket with the moderation desk.'
  },
  {
    id: 'dsr-1',
    category: 'Privacy & Data Rights',
    title: 'How do I request an export or deletion of my data?',
    summary: 'Exercise statutory rights under NDPA 2023 Sec 31 and global GDPR standards.',
    details: 'You can submit a formal Data Subject Request (DSR) through our automated compliance portal or schedule a 30-day permanent account purge from the Account Deletion console.'
  }
];

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const categories = ['all', 'Identity & Sovereignty', 'FIC Vault & Monetization', 'Stercs Studio & Media', 'Sentinel Safety & Compliance', 'Privacy & Data Rights'];

  const filteredTopics = HELP_TOPICS.filter((topic) => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout pageTitle="Help Center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-500">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-950 dark:text-blue-300 text-xs font-bold rounded-full mb-4 border border-blue-400 dark:border-blue-800   font-black">
            <LifebuoyIcon className="w-4 h-4" />
            <span>FingerMobile Knowledge Center</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
            How can we assist you?
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore comprehensive guides for identity sovereignty, FIC financial transactions, content rights, and protocol compliance.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, FIC vault, privacy, or error codes..."
              className="block w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-bold"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Knowledge Bases' : cat}
            </button>
          ))}
        </div>

        {/* Topics List */}
        <div className="space-y-4 mb-12">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-300 w-fit border  border-blue-400 font-black">
                    {topic.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  {topic.summary}
                </p>

                {expandedTopic === topic.id ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
                    <p>{topic.details}</p>
                    <button
                      onClick={() => setExpandedTopic(null)}
                      className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Show less ↑
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setExpandedTopic(topic.id)}
                    className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 gap-1"
                  >
                    <span>Read step-by-step guide</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <QuestionMarkCircleIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                No matching help articles found for "{searchQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Quick Contact & Escalation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <LifebuoyIcon className="w-8 h-8 text-blue-200 mb-3" />
              <h4 className="text-lg font-bold">Contact Support</h4>
              <p className="text-blue-100 text-xs mt-1 leading-relaxed">
                Connect directly with our 24/7 dedicated protocol support specialists.
              </p>
            </div>
            <Link
              to="/contact-support"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors"
            >
              Open Live Ticket
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <QuestionMarkCircleIcon className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Official FAQ</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                Review answered questions regarding smart contracts, FIC payouts, and account limits.
              </p>
            </div>
            <Link
              to="/faq"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Browse All FAQs
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <ShieldCheckIcon className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Privacy & DSR Rights</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                Access your immutable data profile or request statutory account rectification.
              </p>
            </div>
            <Link
              to="/privacy/data-subject-request"
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors border border-purple-200 dark:border-purple-800"
            >
              Exercise Rights
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
