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
    <div className={`p-3 rounded-lg max-w-lg ${message.sender === 'support' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start'}`}>
      <p className="text-sm">{message.text}</p>
      <p className="text-xs text-gray-400 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
    </div>
  );

  const TicketDetailView = () => (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full max-h-[80vh]">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">{selectedTicket?.subject}</h3>
            <p className="text-xs text-gray-500">From: {selectedTicket?.member?.name || 'Unknown'}</p>
          </div>
          <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto flex flex-col">
        {(selectedTicket?.messages || []).map((msg: any) => <ChatBubble key={msg.id} message={msg} />)}
      </div>
      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSendReply}>
          <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} className="w-full p-2 border rounded-md" placeholder="Type your reply..."></textarea>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <button onClick={() => onUpdateStatus(selectedTicket!.id, 'resolved')} type="button" className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-950 border border-green-400 font-bold rounded-full hover:bg-green-200">Mark as Resolved</button>
              <button onClick={() => onUpdateStatus(selectedTicket!.id, 'closed')} type="button" className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300">Close Ticket</button>
            </div>
            <button type="submit" className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700">Send Reply</button>
          </div>
        </form>
      </div>
    </div>
  );

  const TicketListItem: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => (
    <button onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
      <div className="flex justify-between items-center">
        <p className="font-semibold truncate">{ticket.subject}</p>
        <span className="text-xs text-gray-500 flex-shrink-0">{ticket.lastUpdated}</span>
      </div>
      <p className="text-sm text-gray-600">From: {ticket.member?.name || 'Unknown'}</p>
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Support Ticket Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3">Open Tickets ({openTickets.length})</h2>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {openTickets.map((msg: SupportTicket) => (
                <TicketListItem key={msg.id} ticket={msg} />
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3">Closed / Resolved</h2>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {closedTickets.map((t: SupportTicket) => <TicketListItem key={t.id} ticket={t} />)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <TicketDetailView />
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-md text-center text-gray-500 h-full flex items-center justify-center">
              <p>Select a ticket to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; // Added missing closing brace for component function

export default SupportDashboardPage;
