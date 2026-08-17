import React, { useState } from 'react';
import './ProtocolDemo.css';

const ProtocolDemo: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const handleConnect = () => {
    setIsConnected(true);
    setMessages(prev => [...prev, 'System: Connected to protocol.']);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessages(prev => [...prev, 'System: Disconnected from protocol.']);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, `You: ${inputMessage}`]);
      setInputMessage('');
      // Simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, `Server: Received "${inputMessage}"`]);
      }, 1000);
    }
  };

  return (
    <div className="protocol-demo">
      <h2>Protocol Demo</h2>

      <div className="status-indicator">
        Status: <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="controls">
        <button onClick={handleConnect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={handleDisconnect} disabled={!isConnected} style={{ marginLeft: '10px' }}>
          Disconnect
        </button>
      </div>

      <div className="message-sender">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button onClick={handleSendMessage} disabled={!isConnected || !inputMessage.trim()}>
          Send
        </button>
      </div>

      <div className="message-log">
        <h3>Message Log</h3>
        <div className="log-content">
          {messages.map((msg, index) => (
            <div key={index} className="log-entry">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolDemo;