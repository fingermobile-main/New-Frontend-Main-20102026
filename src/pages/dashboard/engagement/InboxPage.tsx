import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { CHAT_CONTACTS } from '../../../constants';
import type { ChatContact, ChatMessage, Contact, Message } from '../../../types';
import AnimatedAvatar from '../../../components/AnimatedAvatar';

const InboxPage: React.FC = () => {
  const { messages, sendMessage, handleSendMessage, getMessages, createConversation, getConversations } = useAppContext();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    CHAT_CONTACTS[0] as ChatContact,
  );
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = useMemo(
    () => (selectedContact ? messages[selectedContact.id] || [] : []),
    [selectedContact, messages],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      handleSendMessage(selectedContact.id, newMessage);
      setNewMessage("");
    }
  };

  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div
      className={`flex items-end gap-2 ${message.sender === "me" ? "justify-end" : ""}`}
    >
      {message.sender === "other" && selectedContact && (
        <AnimatedAvatar
          staticUrl={selectedContact.avatarUrl}
          animatedUrl={selectedContact.animatedAvatarUrl}
          altText={selectedContact.name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div
        className={`max-w-md p-3 rounded-2xl ${message.sender === "me" ? "bg-brand-blue text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 sm:text-2xl lg:text-3xl">
        Engagement Inbox
      </h1>
      <div className="bg-white rounded-xl shadow-md flex h-[calc(100vh-250px)]">
        {/* Contact List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2 border rounded-full text-sm sm:text-sm lg:text-base" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {CHAT_CONTACTS.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact as ChatContact)}
                className={`w-full text-left flex items-center gap-3 p-3 border-l-4 ${selectedContact?.id === contact.id ? "border-brand-blue bg-blue-50" : "border-transparent hover:bg-gray-50"}`}
              >
                <AnimatedAvatar
                  staticUrl={contact.avatarUrl}
                  animatedUrl={contact.animatedAvatarUrl}
                  altText={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate sm:text-sm lg:text-base">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate sm:text-xs lg:text-sm">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white sm:text-xs lg:text-sm">
                    {contact.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Chat Panel */}
        <div className="w-2/3 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <AnimatedAvatar
                  staticUrl={selectedContact.avatarUrl}
                  animatedUrl={selectedContact.animatedAvatarUrl}
                  altText={selectedContact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold sm:text-base lg:text-lg">
                    {selectedContact.name}
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-xs lg:text-sm">
                    @{selectedContact.id}
                  </p>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                {activeMessages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleSend} className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm lg:text-base"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-blue text-white rounded-full hover:bg-blue-700"
                   aria-label="Button"><svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 sm:text-base lg:text-lg">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
