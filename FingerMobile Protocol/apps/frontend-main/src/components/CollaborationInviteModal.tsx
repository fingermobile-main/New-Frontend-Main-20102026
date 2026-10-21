import { Link} from 'react-router-dom';
import React, { useState } from 'react';


interface CollaborationInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  onInvite?: (inviteData: any) => void;
}

const CollaborationInviteModal: React.FC<CollaborationInviteModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName = 'Project',
  onInvite
}) => {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'username' | 'link'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('editor');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendInvite = async () => {
    try {
      setIsSending(true);
      setError(null);

      // Validation
      if (inviteMethod === 'email' && !email.trim()) {
        setError('Please enter an email address');
        return;
      }

      if (inviteMethod === 'username' && !username.trim()) {
        setError('Please enter a username');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const inviteData = {
        projectId,
        method: inviteMethod,
        recipient: inviteMethod === 'email' ? email : username,
        role,
        message,
        sentAt: new Date().toISOString()
      };

      if (onInvite) {
        await onInvite(inviteData);
      }

      setSuccess('Invitation sent successfully!');

      // Reset and close after delay
      setTimeout(() => {
        setEmail('');
        setUsername('');
        setMessage('');
        setSuccess(null);
        onClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsSending(false);
    }
  };

  const generateInviteLink = () => {
    const link = `https://platform.com/invite/${projectId}/${Date.now()}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  const roles = [
    { id: 'viewer', name: 'Viewer', icon: '👁️', description: 'Can view but not edit' },
    { id: 'editor', name: 'Editor', icon: '✏️', description: 'Can view and edit content' },
    { id: 'admin', name: 'Admin', icon: '⚙️', description: 'Full access including settings' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🤝 Invite Collaborator
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Project Info */}
            <div className="bg-gray-50 border border-slate-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Inviting to:</p>
              <p className="font-semibold text-gray-900">{projectName}</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Invite Method Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Invite Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setInviteMethod('email')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    inviteMethod === 'email'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📧 Email
                </button>
                <button
                  onClick={() => setInviteMethod('username')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    inviteMethod === 'username'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👤 Username
                </button>
                <button
                  onClick={() => setInviteMethod('link')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    inviteMethod === 'link'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔗 Link
                </button>
              </div>
            </div>

            {/* Recipient Input */}
            {inviteMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborator@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
            )}

            {inviteMethod === 'username' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
            )}

            {inviteMethod === 'link' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-3">
                  Generate a shareable link that anyone can use to join this project.
                </p>
                <button
                  onClick={generateInviteLink}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔗 Generate & Copy Link
                </button>
              </div>
            )}

            {/* Role Selection */}
            {(inviteMethod === 'email' || inviteMethod === 'username') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role
                </label>
                <div className="space-y-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id as any)}
                      className={`w-full p-3 border-2 rounded-lg transition-all flex items-center gap-3 ${
                        role === r.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-300 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900">{r.name}</div>
                        <div className="text-xs text-gray-600">{r.description}</div>
                      </div>
                      {role === r.id && (
                        <span className="text-blue-600 text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Message */}
            {(inviteMethod === 'email' || inviteMethod === 'username') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-700 mt-1">{message.length}/500 characters</p>
              </div>
            )}

            {/* Submit Button */}
            {(inviteMethod === 'email' || inviteMethod === 'username') && (
              <button
                onClick={handleSendInvite}
                disabled={isSending}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
              >
                {isSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </span>
                ) : (
                  'Send Invitation'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationInviteModal;
