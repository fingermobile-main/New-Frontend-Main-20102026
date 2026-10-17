import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { SupportTicket } from '../../types';

// Define TicketMessage type if it doesn't exist in types
interface TicketMessage {
  id: string;
  sender: 'support' | 'user';
  text: string;
  timestamp: string;
}

const SupportDashboardPage: React.FC = () => {
  const { supportTickets, handleReplyToTicket, handleUpdateTicketStatus, showToast } = useAppContext();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');

  const openTickets = (supportTickets || []).filter((t: SupportTicket) => t.status === 'open' || t.status === 'in-progress');
  const closedTickets = (supportTickets || []).filter((t: SupportTicket) => t.status === 'resolved' || t.status === 'closed');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTicket && reply.trim() && handleReplyToTicket) {
      handleReplyToTicket(selectedTicket.id, reply);
      showToast('Reply sent successfully', 'success');
      setReply('');
    }
  };

  const onUpdateStatus = (ticketId: string, status: SupportTicket['status']) => {
    if (handleUpdateTicketStatus) {
      handleUpdateTicketStatus(ticketId, status);
      showToast(`Ticket status updated to ${status}`, 'success');
    }
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
          <button onClick={() => setSelectedTicket(null)} className="text-slate-600 hover:text-slate-900 text-xl font-bold px-2 py-0.5 rounded-md hover:bg-slate-100">&times;</button>
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
              <button onClick={() => onUpdateStatus(selectedTicket!.id, 'resolved')} type="button" className="px-3 py-1 text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full hover:bg-emerald-200 transition-colors">Mark as Resolved</button>
              <button onClick={() => onUpdateStatus(selectedTicket!.id, 'closed')} type="button" className="px-3 py-1 text-xs font-black bg-slate-200 text-slate-950 rounded-full hover:bg-slate-300 border border-slate-400 transition-colors">Close Ticket</button>
            </div>
            <button type="submit" className="px-5 py-2 text-sm font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors">Send Reply</button>
          </div>
        </form>
      </div>
    </div>
  );

  const TicketListItem: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => (
    <button onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors">
      <div className="flex justify-between items-center">
        <p className="font-bold text-slate-900 truncate text-sm">{ticket.subject}</p>
        <span className="text-xs text-slate-600 font-semibold flex-shrink-0 ml-2">{ticket.lastUpdated}</span>
      </div>
      <p className="text-xs text-slate-700 font-medium mt-0.5">From: {ticket.member?.name || 'Unknown'}</p>
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-6">Support Ticket Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-300">
            <h2 className="text-base font-black text-slate-900 mb-3">Open Tickets ({openTickets.length})</h2>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {openTickets.map((msg: SupportTicket) => (
                <TicketListItem key={msg.id} ticket={msg} />
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-300">
            <h2 className="text-base font-black text-slate-900 mb-3">Closed / Resolved</h2>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {closedTickets.map((t: SupportTicket) => <TicketListItem key={t.id} ticket={t} />)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <TicketDetailView />
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-300 text-center text-slate-700 font-medium h-full flex items-center justify-center">
              <p>Select a ticket to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; // Added missing closing brace for component function

export default SupportDashboardPage;
