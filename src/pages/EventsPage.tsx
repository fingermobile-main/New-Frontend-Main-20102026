import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { generateICSFile } from '../utils/ics';
import { CalendarIcon, GiftIcon, LinkIcon } from '../icons';
import type { Event } from '../types';

// --- Subcomponent: Decoupled Event Card ---
interface EventCardProps {
  event: Event;
  onAddToCalendar: (event: Event) => void;
  onOpenGiftModal: (event: Event) => void;
  onOpenPaylinkModal: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = React.memo(({ event, onAddToCalendar, onOpenGiftModal, onOpenPaylinkModal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover"  />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded-full lg:text-base">{event.category}</div>
        <div className="absolute top-2 right-2 bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded-full lg:text-base">
          {event.ticketPrice} FIC
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-brand-blue lg:text-lg">{(event.date || event.startDate || new Date()).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="font-bold text-lg text-gray-800 truncate my-1 lg:text-xl">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-3 lg:text-base">{event.location}</p>
        <p className="text-sm text-gray-600 mb-4 lg:text-base">{event.description}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => onAddToCalendar(event)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors lg:text-base"
          >
            <CalendarIcon className="w-4 h-4" />
            Add to Calendar
          </button>
          <button
            onClick={() => onOpenGiftModal(event)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors lg:text-base"
          >
            <GiftIcon className="w-4 h-4" />
            Gift Ticket
          </button>
          <button
            onClick={() => onOpenPaylinkModal(event)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors lg:text-base"
          >
            <LinkIcon className="w-4 h-4" />
            Create Paylink
          </button>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

// --- Subcomponent: Decoupled Gift Modal ---
interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  ficBalance: number;
  onSendGift: () => void;
}

const GiftModal: React.FC<GiftModalProps> = React.memo(({ isOpen, onClose, selectedEvent, ficBalance, onSendGift }) => {
  if (!isOpen || !selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 lg:text-2xl">Gift Event Ticket</h3>
        <p className="text-gray-600 mb-2 lg:text-lg">Event: {selectedEvent.title}</p>
        <p className="text-gray-600 mb-4 lg:text-lg">Your FIC Balance: {ficBalance.toLocaleString()} FIC</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter recipient's membername"
            className="w-full px-4 py-2 border rounded-lg lg:text-lg" />
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg lg:text-lg"
            >
              Cancel
            </button>
            <button
              onClick={onSendGift}
              className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg lg:text-lg"
            >
              Send Gift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

GiftModal.displayName = "GiftModal";

// --- Subcomponent: Decoupled Paylink Modal ---
interface PaylinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  ficBalance: number;
  onCreatePaylink: () => void;
}

const PaylinkModal: React.FC<PaylinkModalProps> = React.memo(({ isOpen, onClose, selectedEvent, ficBalance, onCreatePaylink }) => {
  if (!isOpen || !selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 lg:text-2xl">Create Event Ticket Paylink</h3>
        <p className="text-gray-600 mb-2 lg:text-lg">Event: {selectedEvent.title}</p>
        <p className="text-gray-600 mb-4 lg:text-lg">Your FIC Balance: {ficBalance.toLocaleString()} FIC</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter paylink description"
            className="w-full px-4 py-2 border rounded-lg lg:text-lg" />
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg lg:text-lg"
            >
              Cancel
            </button>
            <button
              onClick={onCreatePaylink}
              className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg lg:text-lg"
            >
              Create Paylink
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PaylinkModal.displayName = "PaylinkModal";

const EventsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  
  // Sample events data since EVENTS is not available in constants
  const EVENTS: Event[] = [
    {
      id: '1',
      title: 'Sample Event',
      description: 'This is a sample event description',
      imageUrl: '/path/to/image.jpg',
      date: new Date('2023-12-25'),
      location: 'Virtual',
      ticketPrice: 10,
      category: 'Conference',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const handleAddToCalendar = React.useCallback((event: Event) => {
    if (!event.date && !event.startDate) return;
    generateICSFile({
      ...event,
      start: event.startDate || event.date || new Date(),
      end: event.endDate || event.date || new Date()
    });
    showToast('Event added to calendar');
  }, [showToast]);

  const handleOpenGiftModal = React.useCallback((event: Event) => {
    if (ficBalance < (event.ticketPrice || 0)) {
      showToast('Insufficient FIC balance to send gift', 'error');
      return;
    }

    setSelectedEvent(event);
    setShowGiftModal(true);
  }, [ficBalance, showToast]);

  const handleOpenPaylinkModal = React.useCallback((event: Event) => {
    if (ficBalance < (event.ticketPrice || 0)) {
      showToast('Insufficient FIC balance to create paylink', 'error');
      return;
    }

    setSelectedEvent(event);
    setShowPaylinkModal(true);
  }, [ficBalance, showToast]);

  const handleSendGift = React.useCallback(() => {
    if (!selectedEvent) return;
    showToast('Event ticket gift sent successfully');
    setShowGiftModal(false);
    setSelectedEvent(null);
  }, [selectedEvent, showToast]);

  const handleCreatePaylink = React.useCallback(() => {
    if (!selectedEvent) return;
    showToast('Event ticket paylink created successfully');
    setShowPaylinkModal(false);
    setSelectedEvent(null);
  }, [selectedEvent, showToast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <CalendarIcon className="w-10 h-10 text-brand-blue" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Join our community events, both online and in-person.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map((event: Event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onAddToCalendar={handleAddToCalendar}
            onOpenGiftModal={handleOpenGiftModal}
            onOpenPaylinkModal={handleOpenPaylinkModal}
          />
        ))}
      </div>

      {/* Gift Modal */}
      <GiftModal 
        isOpen={showGiftModal} 
        onClose={() => setShowGiftModal(false)} 
        selectedEvent={selectedEvent} 
        ficBalance={ficBalance} 
        onSendGift={handleSendGift} 
      />

      {/* Paylink Modal */}
      <PaylinkModal 
        isOpen={showPaylinkModal} 
        onClose={() => setShowPaylinkModal(false)} 
        selectedEvent={selectedEvent} 
        ficBalance={ficBalance} 
        onCreatePaylink={handleCreatePaylink} 
      />
    </div>
  );
};

export default EventsPage;