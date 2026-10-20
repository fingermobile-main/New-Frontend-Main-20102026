import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { ShieldIcon, LightBulbIcon, ShieldExclamationIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '../../components/icons';

import PlatformTaskManager from '../../components/dashboard/PlatformTaskManager';
import StercsControlCenter from '../../components/dashboard/StercsControlCenter';
import SentientAIDashboard from '../../components/dashboard/SentientAIDashboard';
import GuardianProtocolDashboard from '../../components/dashboard/GuardianProtocolDashboard';
import PromptsThreatDashboard from '../../components/dashboard/PromptsThreatDashboard';
import RegionalCreatorControlsPanel from '../../components/admin/RegionalCreatorControlsPanel';

import { GuardianSystemStatus, GuardianAlert } from '../../types';

const SuperAdminOverviewPage = () => {
  const { showToast, guardianSystemStatuses, guardianAlerts, handleResolveGuardianAlert } = useAppContext();
  const [activeSystem, setActiveSystem] = useState('overview');

  const commandBank = `
1. Generate report on grant approvals across SouthHub from 12hrs.
2. Retrieve and format session trace from PhotoCredits for member Agent-571.
3. Show all Storefront moderation actions in past 24hrs.
4. Execute full platform diagnostic scan.
5. Initiate emergency protocol sequence.
6. Deploy STERCS threat evaluation matrix.
7. Activate SENTIENT cognitive processing array.
8. Engage GUARDIAN security protocols.
9. Initialize system-wide backup procedure.
10. Run performance optimization routines.
11. Allocate enterprise resources to Region 3.
12. Optimize tactical deployment strategies.
13. Evaluate enterprise resource utilization.
14. Analyze threat patterns across all modules.
15. Cross-reference internal and external system logs.
...and 497 more commands.`;

  const emergencyProtocol = `
========================================
Five-Tier Emergency Framework:
========================================
1. Prevention - Predictive AI scans, inspections, safety checks
2. Mitigation - Alarms, 2FA, Flagging System
3. Preparedness - SOPs, Team Drills, Communication Systems
4. Response - Evacuation Commands, API Lockdowns
5. Recovery - Restoration, Backup Deployment, Psychological UX Protocols
========================================
Action Logic Flow:
========================================
- Check autoAssess()
- Call autoNotify()
- Care firstAidProtocol()
- Evacuate evacService()
- Communicate chainComms()
- Report logIncident()
========================================
Incident Escalation Matrix:
========================================
- Level 1: Post Abuse Flag + Lock + Alert
- Level 2: Fraud Notify Legal & Audit
- Level 3: Downtime Mirror Swap, Notify CTO
- Level 4: Breach Global Lockdown, CTO & GMD Alert
- Level 5: AI/Spam Surge Full Override Mode
========================================
Key Roles:
========================================
- CEO/CTO: Mbah Obinna - System Root
- Secretary: Mrs Eunice Mbah- Compliance & Logs
- CIO, GMD, Admins, and Region Heads - Active Protocol Chains
========================================
Current Status:
========================================
Logic Executed in backend module \`sterics/\`
Admin dashboard panel hooks active
Reporting pipeline to Google Drive and email
WhatsApp, Slack, Email channels on standby
Trigger endpoint: /emergency-trigger [POST]
Prepared by:
AI Sentinel | FingerMobileTM STERCS System
`;

  const StatusCard: React.FC<{ item: GuardianSystemStatus }> = ({ item }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
      <div className="p-2 bg-blue-500/20 rounded-full">
        <ShieldIcon className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <p className="font-semibold text-white">{item.module}</p>
        <p className="text-xs text-slate-300 font-medium">{item.description}</p>
      </div>
      <span className="ml-auto text-sm font-bold text-green-400">{item.status}</span>
    </div>
  );

  const AlertCard: React.FC<{ alert: GuardianAlert }> = ({ alert }) => {
    const severityColors: Record<string, string> = {
      low: 'bg-green-500/20 text-green-300',
      medium: 'bg-orange-500/20 text-orange-300',
      high: 'bg-red-500/20 text-red-300',
      critical: 'bg-red-700/30 text-red-200 animate-pulse'
    };

    return (
      <div className={`p-4 rounded-lg ${severityColors[alert.severity] || 'bg-gray-500/20'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold">{alert.title}</p>
            <p className="text-sm mt-1">{alert.suggestion}</p>
          </div>
          <span className="text-xs">{alert.timestamp}</span>
        </div>
        <div className="text-right mt-2">
          <button onClick={() => handleResolveGuardianAlert(alert.id)} className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full">Mark as Resolved</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Guardian™ Protocol Console</h1>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSystem === 'overview'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('overview')}
          >
                        Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeSystem === 'stercs'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('stercs')}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>STERCS</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeSystem === 'sentient'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('sentient')}
          >
            <LightBulbIcon className="w-4 h-4" />
            <span>SENTIENT</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeSystem === 'guardian'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('guardian')}
          >
            <ShieldExclamationIcon className="w-4 h-4" />
            <span>GUARDIAN</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeSystem === 'prompts'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('prompts')}
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>PRO-MPTS</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeSystem === 'creator-rules'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveSystem('creator-rules')}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>CREATOR QUOTAS</span>
          </button>
        </div>
      </div>

      {activeSystem === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-200">System Status</h2>
              <div className="text-sm text-slate-300 font-medium">
                <span className="inline-flex items-center gap-1 mr-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Enterprise
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Threat
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {guardianSystemStatuses.map((status: GuardianSystemStatus, index: number) => (
                <StatusCard key={index} item={status} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-200">Active Alerts ({guardianAlerts.length})</h2>
              <div className="text-sm text-slate-300 font-medium">
                <span className="inline-flex items-center gap-1 mr-3">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Warning
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Critical
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {guardianAlerts.length > 0 ? (
                guardianAlerts.map((alert: GuardianAlert, index: number) => (
                  <AlertCard key={index} alert={alert} />
                ))
              ) : (
                <p className="text-slate-300 font-medium text-center py-8 bg-gray-800 rounded-lg">All systems normal. No active alerts.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSystem === 'stercs' && <StercsControlCenter />}
      {activeSystem === 'sentient' && <SentientAIDashboard />}
      {activeSystem === 'guardian' && <GuardianProtocolDashboard />}
      {activeSystem === 'prompts' && <PromptsThreatDashboard />}
      {activeSystem === 'creator-rules' && <RegionalCreatorControlsPanel />}

      {/* Platform Task Manager */}
      <div className="mt-8">
        <PlatformTaskManager />
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8">
        <details className="bg-gray-800 p-4 rounded-lg">
          <summary className="font-bold text-lg cursor-pointer">STERCS, GUARDIAN AND PRO-MPTS Command Simulation Bank</summary>
          <div className="mt-4">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                Enterprise Resource
              </span>
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                                Threat Evaluation
              </span>
            </div>
          </div>
          <pre className="text-xs text-gray-300 mt-4 whitespace-pre-wrap font-mono bg-black p-4 rounded-md max-h-96 overflow-auto">
            {commandBank.trim()}
          </pre>
        </details>

        <details className="bg-gray-800 p-4 rounded-lg">
          <summary className="font-bold text-lg cursor-pointer">Emergency Protocol Report</summary>
          <pre className="text-xs text-gray-300 mt-4 whitespace-pre-wrap font-mono bg-black p-4 rounded-md max-h-96 overflow-auto">
            {emergencyProtocol.trim()}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default SuperAdminOverviewPage;
