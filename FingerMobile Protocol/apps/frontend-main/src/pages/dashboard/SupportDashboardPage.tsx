import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { SupportTicket } from '../../types';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

// Define TicketMessage type if it doesn't exist in types
interface TicketMessage {
  id: string;
  sender: 'support' | 'user';
  text: string;
  timestamp: string;
}

const mockFallbackTickets: SupportTicket[] = [
  {
    id: 't-101',
    subject: 'Biometric Enclave Re-Attestation Request',
    status: 'open',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    lastUpdated: '45 mins ago',
    member: {
      id: 'm-1',
      name: 'Dr. Alistair Vance',
      membername: 'avance_neuro',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Our sentinel enclave node in Frankfurt underwent hardware maintenance. We require manual cryptographic re-attestation verification to resume validator duties.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ]
  },
  {
    id: 't-102',
    subject: 'Fiat Settlement Webhook Timeout (EUR/FIC)',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    lastUpdated: '2 hours ago',
    member: {
      id: 'm-2',
      name: 'Maria Santos',
      membername: 'msantos_fin',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    messages: [
      {
        id: 'msg-2',
        sender: 'user',
        text: 'The SEPA instant payout for batch #882 timed out on the gateway webhook. Funds remain locked in FIC Vault escrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      },
      {
        id: 'msg-3',
        sender: 'support',
        text: 'Investigating with the banking gateway sentinels. Vault state will be re-synchronized shortly.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ]
  },
  {
    id: 't-103',
    subject: 'STERC Smart Contract Minting Query',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    lastUpdated: '1 day ago',
    member: {
      id: 'm-3',
      name: 'Tatsuya Sato',
      membername: 'tsato_art',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    messages: [
      {
        id: 'msg-4',
        sender: 'user',
        text: 'Can I mint a batch of 50 STERC creator tokens in a single biometric consensus round?',
        timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
      },
      {
        id: 'msg-5',
        sender: 'support',
        text: 'Yes, batch minting is supported up to 100 tokens per epoch with a single fingerprint consensus proof.',
        timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString()
      }
    ]
  }
];

const SupportDashboardPage: React.FC = () => {
  const { supportTickets, handleReplyToTicket, handleUpdateTicketStatus, showToast } = useAppContext();
  const [localTickets, setLocalTickets] = useState<SupportTicket[]>(mockFallbackTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(mockFallbackTickets[0]);
  const [reply, setReply] = useState('');

  const activeTicketPool = (supportTickets && supportTickets.length > 0) ? supportTickets : localTickets;

  const openTickets = activeTicketPool.filter((t: SupportTicket) => t.status === 'open' || t.status === 'in-progress');
  const closedTickets = activeTicketPool.filter((t: SupportTicket) => t.status === 'resolved' || t.status === 'closed');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket && reply.trim()) {
      if (handleReplyToTicket) {
        handleReplyToTicket(selectedTicket.id, reply);
      }
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        sender: 'support',
        text: reply.trim(),
        timestamp: new Date().toISOString()
      };
      setLocalTickets(prev =>
        prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, messages: [...(t.messages || []), newMsg], lastUpdated: 'Just now' }
            : t
        )
      );
      if (selectedTicket) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...(selectedTicket.messages || []), newMsg],
          lastUpdated: 'Just now'
        });
      }
      showToast('Reply dispatched to ticket', 'success');
      setReply('');
    }
  };

  const onUpdateStatus = (ticketId: string, status: SupportTicket['status']) => {
    if (handleUpdateTicketStatus) {
      handleUpdateTicketStatus(ticketId, status);
    }
    setLocalTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }
    showToast(`Ticket status updated to ${status}`, 'success');
  };

  const ChatBubble: React.FC<{ message: TicketMessage }> = ({ message }) => (
    <div className={`p-3.5 rounded-xl max-w-lg border ${
      message.sender === 'support'
        ? 'bg-blue-50 border-blue-200 text-blue-950 self-end text-right'
        : 'bg-slate-100 border-slate-300 text-slate-900 self-start'
    }`}>
      <p className="text-sm font-semibold">{message.text}</p>
      <p className="text-xs text-slate-600 font-medium mt-1">{new Date(message.timestamp).toLocaleString()}</p>
    </div>
  );

  const TicketDetailView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 flex flex-col h-full max-h-[80vh]">
      <div className="p-4 border-b border-slate-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-900 text-base">{selectedTicket?.subject}</h3>
            <p className="text-xs text-slate-700 font-medium mt-0.5">From: {selectedTicket?.member?.name || 'Unknown'}</p>
          </div>
          <button type="button" onClick={() => setSelectedTicket(null)} className="text-slate-600 hover:text-slate-900 text-xl font-bold px-2 py-0.5 rounded-md hover:bg-slate-100">&times;</button>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto flex flex-col">
        {(selectedTicket?.messages || []).map((msg: any) => <ChatBubble key={msg.id} message={msg} />)}
      </div>
      <div className="p-4 border-t border-slate-300 bg-slate-50">
        <form onSubmit={handleSendReply}>
          <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-sm" placeholder="Type your reply..."></textarea>
          <div className="flex justify-between items-center mt-2.5">
            <div className="flex gap-2">
              <button type="button" onClick={() => onUpdateStatus(selectedTicket!.id, 'resolved')} type="button" className="px-3 py-1 text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full hover:bg-emerald-200 transition-colors">Mark as Resolved</button>
              <button type="button" onClick={() => onUpdateStatus(selectedTicket!.id, 'closed')} type="button" className="px-3 py-1 text-xs font-black bg-slate-200 text-slate-950 rounded-full hover:bg-slate-300 border border-slate-400 transition-colors">Close Ticket</button>
            </div>
            <button type="submit" className="px-5 py-2 text-sm font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Send Reply</button>
          </div>
        </form>
      </div>
    </div>
  );

  const TicketListItem: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => (
    <button type="button" onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors">
      <div className="flex justify-between items-center">
        <p className="font-bold text-slate-900 truncate text-sm">{ticket.subject}</p>
        <span className="text-xs text-slate-600 font-semibold flex-shrink-0 ml-2">{ticket.lastUpdated}</span>
      </div>
      <p className="text-xs text-slate-700 font-medium mt-0.5">From: {ticket.member?.name || 'Unknown'}</p>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Support Operations Dashboard</h1>
        <p className="text-sm text-slate-700 font-medium mt-1">
          Cryptographic participant support, enclave dispute triage, and resolution portal.
        </p>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-slate-900">Active Tickets ({openTickets.length})</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                Needs Review
              </span>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {openTickets.map((msg: SupportTicket) => (
                <TicketListItem key={msg.id} ticket={msg} />
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-300">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-slate-900">Closed / Resolved ({closedTickets.length})</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                Archived
              </span>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {closedTickets.map((t: SupportTicket) => <TicketListItem key={t.id} ticket={t} />)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <TicketDetailView />
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-300 text-center text-slate-800 font-bold h-full flex items-center justify-center">
              <p>Select a ticket from the left queue to view details and issue responses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboardPage;
