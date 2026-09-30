import React, { useState } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, XCircle, FileText,
  Clock, Users, Lock, Eye, Bell, Info, ChevronRight,
  Scale, Gavel, BookOpen
} from 'lucide-react';

export interface GovernancePolicy {
  id: string;
  title: string;
  description?: string;
  category: 'content' | 'privacy' | 'safety' | 'compliance' | 'community';
  status: 'active' | 'pending' | 'deprecated';
  effectiveDate: Date;
  lastUpdated: Date;
  requiresConsent: boolean;
  consented: boolean;
  enforcementLevel: 'strict' | 'moderate' | 'advisory';
  violations: number;
  icon?: React.ReactNode;
}

export interface GovernanceDecision {
  id: string;
  policyId: string;
  action: 'approved' | 'rejected' | 'flagged' | 'reviewed';
  reason: string;
  timestamp: Date;
  reviewedBy: 'ai' | 'human' | 'both';
  confidence?: number;
}

interface GovernancePolicyDisplayProps {
  policies?: GovernancePolicy[];
  recentDecisions?: GovernanceDecision[];
  onConsentChange?: (policyId: string, consented: boolean) => void;
  onViewDetails?: (policyId: string) => void;
}

const defaultPolicies: GovernancePolicy[] = [
  {
    id: 'policy_001',
    title: 'Content Classification Standards',
    description: 'All media content is classified using IARC standards to ensure age-appropriate viewing.',
    category: 'content',
    status: 'active',
    effectiveDate: new Date('2026-01-01'),
    lastUpdated: new Date('2026-04-01'),
    requiresConsent: true,
    consented: true,
    enforcementLevel: 'strict',
    violations: 234
  },
  {
    id: 'policy_002',
    title: 'AI-Driven Content Moderation',
    description: 'Automated scanning and filtering of inappropriate content using advanced AI models.',
    category: 'safety',
    status: 'active',
    effectiveDate: new Date('2026-01-15'),
    lastUpdated: new Date('2026-03-28'),
    requiresConsent: true,
    consented: true,
    enforcementLevel: 'strict',
    violations: 89
  },
  {
    id: 'policy_003',
    title: 'Privacy & Data Protection',
    description: 'Member data is encrypted and processed in accordance with global privacy standards.',
    category: 'privacy',
    status: 'active',
    effectiveDate: new Date('2026-01-01'),
    lastUpdated: new Date('2026-04-05'),
    requiresConsent: true,
    consented: false,
    enforcementLevel: 'strict',
    violations: 12
  },
  {
    id: 'policy_004',
    title: 'Community Guidelines',
    description: 'Standards for respectful and constructive community interaction.',
    category: 'community',
    status: 'active',
    effectiveDate: new Date('2026-02-01'),
    lastUpdated: new Date('2026-03-15'),
    requiresConsent: false,
    consented: true,
    enforcementLevel: 'moderate',
    violations: 456
  },
  {
    id: 'policy_005',
    title: 'Regulatory Compliance Framework',
    description: 'Adherence to regional and international content regulations.',
    category: 'compliance',
    status: 'active',
    effectiveDate: new Date('2026-01-01'),
    lastUpdated: new Date('2026-04-08'),
    requiresConsent: false,
    consented: true,
    enforcementLevel: 'strict',
    violations: 3
  }
];

const GovernancePolicyDisplay: React.FC<GovernancePolicyDisplayProps> = ({
  policies = defaultPolicies,
  recentDecisions = [],
  onConsentChange,
  onViewDetails
}) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [expandedPolicy, setExpandedPolicy] = React.useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Policies', icon: <BookOpen size={16} /> },
    { id: 'content', label: 'Content', icon: <FileText size={16} /> },
    { id: 'safety', label: 'Safety', icon: <Shield size={16} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={16} /> },
    { id: 'community', label: 'Community', icon: <Users size={16} /> },
    { id: 'compliance', label: 'Compliance', icon: <Gavel size={16} /> }
  ];

  const filteredPolicies = activeFilter === 'all'
    ? policies
    : policies.filter(p => p.category === activeFilter);

  const getStatusIcon = (status: GovernancePolicy['status']) => {
    switch (status) {
    case 'active': return <CheckCircle size={18} className="text-green-500" />;
    case 'pending': return <Clock size={18} className="text-yellow-500" />;
    case 'deprecated': return <XCircle size={18} className="text-gray-500" />;
    }
  };

  const getEnforcementBadge = (level: GovernancePolicy['enforcementLevel']) => {
    switch (level) {
    case 'strict': return <Shield size={14} className="text-red-500" />;
    case 'moderate': return <AlertTriangle size={14} className="text-yellow-500" />;
    case 'advisory': return <Info size={14} className="text-blue-500" />;
    }
  };

  const handleConsentToggle = (policyId: string, currentConsent: boolean) => {
    if (onConsentChange) {
      onConsentChange(policyId, !currentConsent);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <Scale className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">AI Governance Policies</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Transparent. Accountable. Secure.</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          The FingerMobile Protocol™ employs AI-driven governance to ensure content safety, regulatory compliance,
          and community standards. All policies are continuously monitored and updated to protect our members.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
              activeFilter === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {filteredPolicies.map(policy => (
          <div
            key={policy.id}
            className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all ${
              expandedPolicy === policy.id ? 'ring-2 ring-blue-500/50' : 'hover:bg-white/[0.07]'
            }`}
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => setExpandedPolicy(expandedPolicy === policy.id ? null : policy.id)} role="button" tabIndex={0}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(policy.status)}
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{policy.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{policy.description}</p>

                  <div className="flex items-center space-x-6 text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-gray-400">Updated {policy.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={14} className="text-orange-500" />
                      <span className="text-gray-400">{policy.violations} violations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEnforcementBadge(policy.enforcementLevel)}
                      <span className="text-gray-400 capitalize">{policy.enforcementLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  {policy.requiresConsent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConsentToggle(policy.id, policy.consented);
                      }}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                        policy.consented
                          ? 'bg-green-600/20 text-green-500 border border-green-500/30'
                          : 'bg-gray-800 text-gray-400 border border-white/10 hover:border-blue-500'
                      }`}
                    >
                      {policy.consented ? 'Consented' : 'Consent Required'}
                    </button>
                  )}
                  <ChevronRight
                    size={20}
                    className={`text-gray-500 transition-transform ${expandedPolicy === policy.id ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedPolicy === policy.id && (
              <div className="border-t border-white/5 bg-black/20 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white/5 rounded-2xl">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Policy Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white font-bold capitalize">{policy.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white font-bold capitalize">{policy.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Effective Date:</span>
                        <span className="text-white font-bold">{policy.effectiveDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Enforcement:</span>
                        <span className="text-white font-bold capitalize">{policy.enforcementLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/5 rounded-2xl">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Enforcement & Monitoring</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">AI Monitoring:</span>
                        <CheckCircle size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Real-time Scanning:</span>
                        <Eye size={16} className="text-blue-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Alerts Enabled:</span>
                        <Bell size={16} className="text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => onViewDetails?.(policy.id)}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all uppercase tracking-wider text-xs"
                  >
                    View Full Policy
                  </button>
                  {policy.requiresConsent && !policy.consented && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConsentToggle(policy.id, policy.consented);
                      }}
                      className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all uppercase tracking-wider text-xs"
                    >
                      Grant Consent
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Decisions */}
      {recentDecisions.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center space-x-3">
            <Gavel size={20} className="text-blue-500" />
            <span>Recent Governance Decisions</span>
          </h3>
          <div className="space-y-4">
            {recentDecisions.slice(0, 5).map(decision => (
              <div key={decision.id} className="flex items-center justify-between p-5 bg-black/20 rounded-2xl">
                <div className="flex items-center space-x-4">
                  {decision.action === 'approved' && <CheckCircle size={18} className="text-green-500" />}
                  {decision.action === 'rejected' && <XCircle size={18} className="text-red-500" />}
                  {decision.action === 'flagged' && <AlertTriangle size={18} className="text-yellow-500" />}
                  {decision.action === 'reviewed' && <Eye size={18} className="text-blue-500" />}
                  <div>
                    <p className="text-sm font-bold text-white capitalize">{decision.action}</p>
                    <p className="text-xs text-gray-400">{decision.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{decision.timestamp.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 uppercase">By {decision.reviewedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernancePolicyDisplay;
