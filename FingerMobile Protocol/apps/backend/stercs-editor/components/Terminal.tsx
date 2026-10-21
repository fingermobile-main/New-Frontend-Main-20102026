import React, { useState, useEffect, memberef } from 'react';

interface CommandHistoryItem {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(
    [],
  );
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isTerminalOpememberetIsTerminalOpen] = useState<boolean>(false);
  const [isLoading, memberIsLoading] = useState<boolean>(false);
  const terminalRef = memberef<HTMLDivElement>(null);
  const inputRef = memberef<HTMLInputElement>(null);

  // Scroll to bottom of terminal when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal is open
  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalOpen]);

  // Handle command execution
  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setIsLoading(true);

    // Add command to output
    const newOutput = [...output, `$ ${cmd}`, ''];
    setOutput(newOutput);

    try {
      // Make API call to execute command
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token
        },
        body: JSON.stringify({
          command: cmd,
          options: { cwd: process.cwd ? process.cwd() : '/' }, // Use current working directory
        })
      });

      const result = await response.json();

      if (result.success) {
        const commandOutput = result.data.output
          ? result.data.output.split('\n')
          : ['Command executed successfully'];
        setOutput((prev) => [...prev, ...commandOutput, '']);

        // Add to command history
        const historyItem: CommandHistoryItem = {
          id: Date.now().toString(),
          command: cmd,
          output: result.data.output || 'Command executed successfully',
          timestamp: new Date()
        };
        setCommandHistory((prev) => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 commands
      } else {
        setOutput((prev) => [...prev, `Error: ${result.message}`, '']);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      setOutput((prev) => [...prev, `Error: ${(error as Error).message}`, '']);
    }

    setIsLoading(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    executeCommand(input);
    setInput('');
  };

  // Handle key down for history navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : commandHistory.length - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      // Handle Ctrl+C to cancel command
      setIsLoading(false);
      setOutput((prev) => [...prev, '^C', '']);
    }
  };

  // Toggle terminal visibility
  const toggleTerminal = () => {
    setIsTerminalOpen(!isTerminalOpen);
  };

  // Clear terminal
  const clearTerminal = () => {
    setOutput([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  // Special commands
  const handleSpecialCommands = (cmd: string) => {
    if (cmd === 'clear' || cmd === 'cls') {
      clearTerminal();
      return true;
    }
    if (cmd === 'help') {
      setOutput((prev) => [
        ...prev,
        'Available commands:',
        '  help - Show this help message',
        '  clear/cls - Clear the terminal',
        '  history - Show command history',
        '  exit - Close the terminal',
        ''
      ]);
      return true;
    }
    if (cmd === 'history') {
      if (commandHistory.length > 0) {
        const historyList = commandHistory
          .slice(0, 10)
          .map((item, index) => `${index + 1}. ${item.command}`);
        setOutput((prev) => [...prev, ...historyList, '']);
      } else {
        setOutput((prev) => [...prev, 'No command history', '']);
      }
      return true;
    }
    if (cmd === 'exit') {
      setIsTerminalOpen(false);
      return true;
    }
    return false;
  };

  // Process input before sending
  const processInput = (cmd: string) => {
    // Check for special commands first
    if (handleSpecialCommands(cmd)) {
      return;
    }

    // Execute the command
    executeCommand(cmd);
  };

  return (
    <div
      className="terminal-container"
      style={{
        position: 'fixed',
        bottom: isTerminalOpen ? '0' : '-300px',
        left: '0',
        right: '0',
        height: '300px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        zIndex: 1000,
        transition: 'bottom 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="terminal-header"
        style={{
          padding: '8px 12px',
          backgroundColor: '#0d3b66',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={toggleTerminal}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
              marginRight: '8px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsTerminalOpen(false);
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ffbd2e',
              marginRight: '8px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              clearTerminal();
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#28c940',
              marginRight: '16px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              processInput('clear');
            }}
          />
          <span style={{ fontWeight: 'bold' }}>STERCS Terminal</span>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              processInput('clear');
            }}
            style={{
              backgroundColor: '#3a3d41',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Clear
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTerminalOpen(false);
            }}
            style={{
              backgroundColor: '#e81123',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="terminal-output"
        style={{
          flex: 1,
          padding: '12px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap'
        }}
      >
        {output.map((line, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            {line}
          </div>
        ))}
        {isLoading && (
          <div style={{ opacity: 0.7 }}>
            <span>Executing command...</span>
            <span className="cursor" style={{ marginLeft: '4px' }}>
              |
            </span>
          </div>
        )}
      </div>

      <form
        className="terminal-input-form"
        style={{
          display: 'flex',
          padding: '8px 12px',
          backgroundColor: '#252526'
        }}
        onSubmit={handleSubmit}
      >
        <span style={{ color: '#23aaff', marginRight: '8px' }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            color: '#d4d4d4',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default Terminal;
